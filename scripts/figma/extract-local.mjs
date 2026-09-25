import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { inflateRawSync, zstdDecompressSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const [source, decoderPath, destination = 'output/figma-local'] = process.argv.slice(2);
if (!source || !decoderPath) {
  throw new Error('Usage: node scripts/figma/extract-local.mjs file.fig /path/to/kiwi-schema');
}
const output = resolve(destination);
mkdirSync(output, { recursive: true });
// Extract only known entries; do not trust archive paths or execute embedded plugin data.
execFileSync('python3', [
  '-c',
  `
import zipfile, pathlib, sys, re
out=pathlib.Path(sys.argv[2])
with zipfile.ZipFile(sys.argv[1]) as archive:
    if archive.testzip(): raise ValueError('Damaged archive')
    for item in archive.infolist():
        if item.filename in ['canvas.fig','meta.json','thumbnail.png'] or re.fullmatch(r'images/[a-f0-9]{40}',item.filename):
            target=out/item.filename
            target.parent.mkdir(parents=True,exist_ok=True)
            target.write_bytes(archive.read(item))
`,
  resolve(source),
  output,
]);
const require = createRequire(import.meta.url);
const { decodeBinarySchema, compileSchema } = require(resolve(decoderPath));
const data = readFileSync(join(output, 'canvas.fig'));
if (data.subarray(0, 8).toString() !== 'fig-kiwi') throw new Error('Invalid canvas signature');
let offset = 12;
const chunks = [];
while (offset < data.length) {
  if (offset + 4 > data.length) throw new Error('Truncated chunk header');
  const length = data.readUInt32LE(offset);
  offset += 4;
  if (length < 4 || offset + length > data.length) throw new Error('Invalid chunk length');
  const chunk = data.subarray(offset, offset + length);
  offset += length;
  chunks.push(
    chunk.readUInt32LE(0) === 0xfd2fb528 ? zstdDecompressSync(chunk) : inflateRawSync(chunk),
  );
}
const document = compileSchema(decodeBinarySchema(chunks[0])).decodeMessage(chunks[1]);
const stringify = (value) =>
  JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? String(v) : v));
const id = (guid) => `${guid.sessionID}:${guid.localID}`;
const nodes = new Map(document.nodeChanges.map((node) => [id(node.guid), node]));
const children = new Map();
for (const node of nodes.values()) {
  if (!node.parentIndex) continue;
  const parent = id(node.parentIndex.guid);
  if (!children.has(parent)) children.set(parent, []);
  children.get(parent).push(id(node.guid));
}
writeFileSync(join(output, 'document.json'), stringify(document));
const inventory = JSON.parse(readFileSync('docs/figma-inventory.json', 'utf8'));
mkdirSync(join(output, 'frames'), { recursive: true });
const frames = inventory.map((frame) => {
  const root = nodes.get(frame.id);
  if (!root) return { id: frame.id, found: false };
  const descendants = [];
  const collect = (nodeId) => {
    descendants.push(nodes.get(nodeId));
    for (const child of children.get(nodeId) ?? []) collect(child);
  };
  collect(frame.id);
  writeFileSync(
    join(output, 'frames', `${frame.id.replace(':', '-')}.json`),
    stringify(descendants),
  );
  return {
    id: frame.id,
    found: true,
    name: root.name,
    size: root.size,
    expectedSize: { x: frame.w, y: frame.h },
    nodes: descendants.length,
  };
});
const report = {
  sourceSha256: createHash('sha256').update(readFileSync(source)).digest('hex'),
  canvasVersion: data.readUInt32LE(8),
  nodeCount: nodes.size,
  matchedFrames: frames.filter((frame) => frame.found).length,
  frames,
};
writeFileSync(join(output, 'report.json'), JSON.stringify(report, null, 2));
console.log(
  `Decoded ${nodes.size} nodes; matched ${report.matchedFrames}/${frames.length} frames.`,
);

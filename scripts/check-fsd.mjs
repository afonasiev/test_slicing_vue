import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("src");
const layers = ["app", "pages", "widgets", "features", "entities", "shared"];
const errors = [];
const graph = new Map();
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const name = path.join(directory, entry.name);
        return entry.isDirectory() ? files(name) : [name];
      }),
    )
  ).flat();
}
async function resolve(base) {
  for (const candidate of [
    base,
    ...[".ts", ".vue", ".scss"].map((ext) => base + ext),
    path.join(base, "index.ts"),
  ]) {
    if (
      await stat(candidate)
        .then((entry) => entry.isFile())
        .catch(() => false)
    )
      return candidate;
  }
}
function location(file) {
  const parts = path.relative(root, file).split(path.sep);
  const layer = parts[0];
  return { layer, rank: layers.indexOf(layer), slice: parts[1] };
}
for (const file of await files(root)) {
  if (!/\.(ts|vue|scss)$/.test(file)) continue;
  const source = await readFile(file, "utf8");
  const origin = location(file);
  const edges = [];
  graph.set(file, edges);
  // Static imports, reexports, literal dynamic imports and external SFC styles/scripts.
  const imports =
    /(?:\bfrom\s*|\bimport\s*(?:\(\s*)?|\bsrc\s*=\s*|@(?:use|forward|import)\s*)['"]([^'"]+)['"]/g;
  for (const [, specifier] of source.matchAll(imports)) {
    if (!specifier.startsWith("@/") && !specifier.startsWith(".")) continue;
    const base = specifier.startsWith("@/")
      ? path.join(root, specifier.slice(2))
      : path.resolve(path.dirname(file), specifier);
    const target = await resolve(base);
    if (!target) {
      errors.push(`${path.relative(root, file)}: unresolved ${specifier}`);
      continue;
    }
    const destination = location(target);
    edges.push(target);
    if (origin.rank < 0) continue; // src/main.ts is the bootstrap entry.
    const sameSlice = origin.layer === destination.layer && origin.slice === destination.slice;
    if (destination.rank < origin.rank || destination.rank < 0) {
      errors.push(`${path.relative(root, file)}: upward import ${specifier}`);
    } else if (
      origin.rank === destination.rank &&
      !sameSlice &&
      !["app", "shared"].includes(origin.layer)
    ) {
      errors.push(`${path.relative(root, file)}: cross-slice import ${specifier}`);
    }
    if (origin.layer !== destination.layer || (!sameSlice && origin.layer === "shared")) {
      if (!/\.(png|svg|woff2|scss)$/.test(target) && path.basename(target) !== "index.ts") {
        errors.push(`${path.relative(root, file)}: use the public index.ts for ${specifier}`);
      }
    }
  }
}
const visited = new Set();
const active = new Set();
function visit(file) {
  if (active.has(file)) {
    errors.push(`Circular dependency at ${path.relative(root, file)}`);
    return;
  }
  if (visited.has(file)) return;
  active.add(file);
  for (const target of graph.get(file) || []) visit(target);
  active.delete(file);
  visited.add(file);
}
for (const file of graph.keys()) visit(file);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `FSD: ${graph.size} source files checked; downward imports, public APIs and no cycles.`,
  );
}

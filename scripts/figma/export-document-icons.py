"""Export original document and close icons from the local decoded Figma file."""
from pathlib import Path
import struct

helpers = {}
source = Path('scripts/figma/export-cards.py').read_text().split('root = next')[0]
exec(source, helpers)
nodes = helpers['document']['nodeChanges']
key = helpers['key']
children = {}
for node in nodes:
    if node.get('parentIndex'):
        children.setdefault(key(node['parentIndex']['guid']), []).append(node)
helpers['children'] = children
for name, node_id in [('telegram', '258:16601'), ('unlockDatabase', '258:15633'), ('unlockLock', '258:15642'), ('unlockWallet', '258:15651'), ('verificationBank', '258:17745'), ('verificationShield', '258:17753'), ('verificationUser', '258:17814'), ('verificationScanner', '258:17762'), ('documentFile', '246:5335'), ('documentCard', '246:5355'), ('close', '1:1368'), ('arrowLeft', '0:75'), ('paymentCard', '1:380'), ('transferBank', '246:8568'), ('transferCheck', '246:8580'), ('transferLogo', '246:8656'), ('transferClock', '246:8677'), ('transferError', '246:8897'), ('transferInfo', '246:8912'), ('certificateShield', '256:12657'), ('certificateClose', '256:12235'), ('certificateZoom', '256:12241'), ('certificateLock', '256:12248'), ('chatClose', '232:18310'), ('chatAttachment', '232:18337'), ('chatSend', '232:18342'), ('certificateProgressShield', '256:13103'), ('certificateProgressActive', '256:13180')]:
    node = next(node for node in nodes if key(node['guid']) == node_id)
    size = node['size']
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size["x"]} {size["y"]}">'
    if name == 'arrowLeft':
        # This original Lucide component stores its strokes as a vector network,
        # not baked fillGeometry. Read the original vertices and segments.
        vector = children[node_id][0]
        blob = helpers['document']['blobs'][vector['vectorData']['vectorNetworkBlob']]
        raw = bytes(blob['bytes'].values())
        vertex_count, segment_count, _ = struct.unpack_from('<III', raw)
        vertices = [struct.unpack_from('<Iff', raw, 12 + i * 12)[1:] for i in range(vertex_count)]
        paths = []
        for i in range(segment_count):
            _, start, sx, sy, end, ex, ey = struct.unpack_from('<IIffIff', raw, 12 + vertex_count * 12 + i * 28)
            x, y = vertices[start]
            u, v = vertices[end]
            paths.append(f'M{x} {y} C{x + sx} {y + sy} {u + ex} {v + ey} {u} {v}')
        stroke = helpers['color'](vector['strokePaints'][0]['color'])
        transform = helpers['matrix'](vector['transform'])
        svg += f'<path transform="matrix({transform})" d="{" ".join(paths)}" fill="none" stroke="{stroke}" stroke-width="{vector["strokeWeight"]}" stroke-linecap="round" stroke-linejoin="round"/>'
    else:
        svg += helpers['render'](node, True)
    svg += '</svg>'
    if '<path' not in svg:
        raise ValueError(f'No rendered paths for {name}')
    Path(f'src/shared/assets/icons/{name}.svg').write_text(svg)
    Path(f'src/shared/ui/icons/svgs/credit_profile_icon_{name}.vue').write_text('<template>\n' + svg + '\n</template>\n')

"""Export the original credit-card vectors and outlined glyphs from decoded Figma."""
import json
import struct
from pathlib import Path

source = Path('output/figma-local')
document = json.loads((source / 'document.json').read_text())
nodes = json.loads((source / 'frames/0-1177.json').read_text())
def key(node):
    return f"{node['sessionID']}:{node['localID']}"
children = {}
for node in nodes:
    children.setdefault(key(node['parentIndex']['guid']), []).append(node)
def number(value):
    return f'{value:.5f}'.rstrip('0').rstrip('.') if value else '0'
def path(blob):
    data = bytes(document['blobs'][blob]['bytes'].values())
    offset, commands = 0, []
    while offset < len(data):
        command = data[offset]
        offset += 1
        count = [0, 2, 2, 4, 6][command]
        values = struct.unpack_from('<' + 'f' * count, data, offset)
        offset += count * 4
        if command or commands:
            commands.append('ZMLQC'[command] + ' '.join(map(number, values)))
    return ' '.join(commands)
def color(value):
    return '#' + ''.join(f'{round(value[channel] * 255):02x}' for channel in 'rgb')
def matrix(t):
    return ' '.join(number(t[k]) for k in ['m00', 'm10', 'm01', 'm11', 'm02', 'm12'])
gradient_count = 0
def geometry(items, paint):
    global gradient_count
    if not paint or paint.get('visible') is False:
        return ''
    definitions = ''
    fill = color(paint['color']) if paint['type'] == 'SOLID' else ''
    if paint['type'] == 'GRADIENT_LINEAR':
        gradient_count += 1
        ident = f'gradient{gradient_count}'
        t = paint['transform']
        det = t['m00'] * t['m11'] - t['m01'] * t['m10']
        def inverse(x, y):
            x, y = x - t['m02'], y - t['m12']
            return ((t['m11'] * x - t['m01'] * y) / det, (-t['m10'] * x + t['m00'] * y) / det)
        x1, y1 = inverse(0, .5)
        x2, y2 = inverse(1, .5)
        stops = ''.join(f'<stop offset="{stop["position"]}" stop-color="{color(stop["color"])}" stop-opacity="{stop["color"].get("a", 1)}"/>' for stop in paint['stops'])
        definitions = f'<defs><linearGradient id="{ident}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">{stops}</linearGradient></defs>'
        fill = f'url(#{ident})' 
    opacity = paint.get('opacity', 1)
    return definitions + ''.join(f'<path d="{path(g["commandsBlob"])}" fill="{fill}" opacity="{opacity}" fill-rule="{"evenodd" if g["windingRule"] == "ODD" else "nonzero"}"/>' for g in items)
def render(n, root=False):
    if n.get('visible') is False:
        return ''
    content = ''
    for paint in n.get('fillPaints', []):
        content += geometry(n.get('fillGeometry', []), paint)
        if n['type'] == 'TEXT':
            for glyph in n.get('derivedTextData', {}).get('glyphs', []):
                pos, size = glyph['position'], glyph['fontSize']
                content += f'<path fill="{color(paint["color"])}" transform="translate({number(pos["x"])} {number(pos["y"])}) scale({number(size)} {number(-size)})" d="{path(glyph["commandsBlob"])}"/>'
    for paint in n.get('strokePaints', []):
        content += geometry(n.get('strokeGeometry', []), paint)
    content += ''.join(render(child) for child in sorted(children.get(key(n['guid']), []), key=lambda c:c['parentIndex']['position']))
    transform = '' if root else f' transform="matrix({matrix(n["transform"])})"'
    shadow = ' filter="url(#shadow)"' if any(e['type'] == 'DROP_SHADOW' for e in n.get('effects', [])) else ''
    prefix = ''
    if key(n['guid']) == '0:1206':
        background = ''.join(render(item) for item in nodes if key(item['guid']) in ['0:1184', '0:1195'])
        prefix = f'<defs><clipPath id="glass"><path transform="matrix({matrix(n["transform"])})" d="{path(300)}"/></clipPath><filter id="glassBlur"><feGaussianBlur stdDeviation="6.83767"/></filter></defs><g clip-path="url(#glass)"><g filter="url(#glassBlur)">{background}</g></g>'
    return prefix + f'<g{transform}{shadow}>{content}</g>' 
root = next(n for n in nodes if key(n['guid']) == '0:1182')
svg = '<svg xmlns="http://www.w3.org/2000/svg" width="584" height="550" viewBox="-20 -20 584 550"><defs><linearGradient id="edge" x2="1" y2="1"><stop stop-color="white"/><stop offset="1" stop-color="white" stop-opacity=".55"/></linearGradient><filter id="shadow" x="-20%" y="-20%" width="150%" height="150%"><feDropShadow dx="3.41884" dy="19.65831" stdDeviation="10.25651" flood-opacity=".08"/></filter></defs>' + render(root, True) + '</svg>'
Path('src/shared/assets/approved-cards.svg').write_text(svg)
print('Exported original card paths and glyph outlines: 0:1182')
info = next(n for n in nodes if key(n['guid']) == '0:1228')
info_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">' + render(info, True) + '</svg>'
Path('src/shared/assets/icons/info.svg').write_text(info_svg)
Path('src/shared/ui/icons/svgs/credit_profile_icon_info.vue').write_text('<template>\n' + info_svg + '\n</template>\n')
nodes = json.loads((source / 'frames/0-1235.json').read_text())
children = {}
for node in nodes:
    children.setdefault(key(node['parentIndex']['guid']), []).append(node)
eye = next(n for n in nodes if key(n['guid']) == '0:1325')
eye_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">' + render(eye, True) + '</svg>'
Path('src/shared/assets/icons/eye.svg').write_text(eye_svg)
Path('src/shared/ui/icons/svgs/credit_profile_icon_eye.vue').write_text('<template>\n' + eye_svg + '\n</template>\n')

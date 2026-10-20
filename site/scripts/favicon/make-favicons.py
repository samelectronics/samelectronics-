#!/usr/bin/env python3
"""R6 §01 · favicons from the original round logo (public/assets/se-logo.png) with a clear Signal Yellow ring, exactly
like the header logo. 16px uses a simplified mark (the two devices only) so it stays crisp.
  cd site && python3 -I scripts/favicon/make-favicons.py"""
import base64, io, os
from PIL import Image, ImageDraw
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
P = lambda *a: os.path.join(ROOT, 'public', *a)
Y, INK = (247, 192, 50, 255), (61, 62, 63, 255)

def ringed(size, ring=Y):
    S = size * 4
    logo = Image.open(P('assets', 'se-logo.png')).convert('RGBA').resize((S, S), Image.LANCZOS)
    out = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    m = Image.new('L', (S, S), 0); ImageDraw.Draw(m).ellipse((0, 0, S - 1, S - 1), fill=255)
    white = Image.new('RGBA', (S, S), (255, 255, 255, 255)); out.paste(white, (0, 0), m)
    r = int(S * 0.07); inner = Image.new('L', (S, S), 0); ImageDraw.Draw(inner).ellipse((r, r, S - 1 - r, S - 1 - r), fill=255)
    lg = logo.resize((S - 2 * r, S - 2 * r), Image.LANCZOS); out.paste(lg, (r, r), Image.composite(lg.getchannel('A'), Image.new('L', lg.size, 0), inner.crop((r, r, S - r, S - r))))
    ImageDraw.Draw(out).ellipse((r // 2, r // 2, S - 1 - r // 2, S - 1 - r // 2), outline=ring, width=r)
    return out.resize((size, size), Image.LANCZOS)

def simple(size):
    S = 256; im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.ellipse((0, 0, S - 1, S - 1), fill=(255, 255, 255, 255)); d.ellipse((12, 12, S - 13, S - 13), outline=Y, width=26)
    d.rounded_rectangle((62, 66, 142, 196), 14, outline=INK, width=16)   # the tall phone
    d.rounded_rectangle((118, 92, 190, 196), 12, fill=(255, 255, 255, 255), outline=INK, width=16)  # the second device, in front
    return im.resize((size, size), Image.LANCZOS)

for s in (32, 48): ringed(s).save(P(f'favicon-{s}.png'))
simple(16).save(P('favicon-16.png'))
ringed(180).save(P('apple-touch-icon.png')); ringed(192).save(P('icon-192.png')); ringed(512).save(P('icon-512.png'))
ringed(48).save(P('favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
b = io.BytesIO(); ringed(128).save(b, 'PNG')
with open(P('favicon.svg'), 'w') as f:
    f.write('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 128 128"><image width="128" height="128" href="data:image/png;base64,' + base64.b64encode(b.getvalue()).decode() + '"/></svg>\n')
ringed(32, (176, 160, 118, 255)).save(P('favicon-dim-32.png'))  # the ring dims while the tab is in the background
print('favicons written')

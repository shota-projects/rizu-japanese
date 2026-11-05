"""Crop the three mascot poses from img/mascot-sheet.jpg and cut out the cream background.
Run: python3 tools/make_mascot.py  (needs Pillow + numpy)"""
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

SHEET = 'img/mascot-sheet.jpg'
CROPS = {  # (left, top, right, bottom) in sheet pixels (1280x720)
    'wave':  (40, 170, 445, 600),
    'cheer': (440, 40, 835, 605),
    'think': (840, 95, 1250, 605),
}

def label(mask):
    h, w = mask.shape
    lab = np.zeros((h, w), np.int32); n = 0; info = []
    for y0 in range(h):
        for x0 in range(w):
            if mask[y0, x0] and not lab[y0, x0]:
                n += 1; q = deque([(y0, x0)]); lab[y0, x0] = n; size = 0; edge = False
                while q:
                    y, x = q.popleft(); size += 1
                    if y in (0, h - 1) or x in (0, w - 1): edge = True
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        yy, xx = y + dy, x + dx
                        if 0 <= yy < h and 0 <= xx < w and mask[yy, xx] and not lab[yy, xx]:
                            lab[yy, xx] = n; q.append((yy, xx))
                info.append((n, size, edge))
    return lab, info

sheet = Image.open(SHEET).convert('RGB')
for name, box in CROPS.items():
    im = sheet.crop(box); a = np.asarray(im).astype(int)
    mn, mx = a.min(2), a.max(2)
    cream = (mn > 228) & ((mx - mn) < 26)
    # background = cream pixels connected to the border
    lab, info = label(cream)
    bg = np.zeros(cream.shape, bool)
    for n, size, edge in info:
        if edge: bg |= lab == n
    fg = ~bg
    # drop foreground bits cut off by the crop edge and tiny specks
    lab2, info2 = label(fg)
    keep = np.zeros(fg.shape, bool)
    for n, size, edge in info2:
        if not edge and size > 60: keep |= lab2 == n
    alpha = Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    out = im.convert('RGBA'); out.putalpha(alpha)
    out = out.crop(out.getbbox())
    out.save(f'img/mascot-{name}.png', optimize=True)
    print(name, out.size)

"""Draws the share-image background (night sky) and badge used by src/pages/og/[...route].ts.
Needs Pillow: pip install pillow. Run: python3 scripts/og-assets.py"""
import random
from PIL import Image, ImageChops, ImageDraw, ImageFilter

W, H = 1200, 630
S = 2  # draw at 2x and scale down, for smooth edges
random.seed(7)

def lerp(a, b, t): return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
stops = [(0.0, (6, 8, 20)), (0.42, (14, 20, 64)), (0.78, (35, 31, 102)), (1.0, (74, 47, 125))]
def sky(t):
    for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
        if t <= t1: return lerp(c0, c1, (t - t0) / (t1 - t0))
    return stops[-1][1]

def box(cx, cy, r): return [(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S]

img = Image.new('RGB', (W * S, H * S))
d = ImageDraw.Draw(img)
for y in range(H * S): d.line([(0, y), (W * S, y)], fill=sky(y / (H * S - 1)))
img = img.convert('RGBA')

# drifting dusk clouds
clouds = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
cd = ImageDraw.Draw(clouds)
cd.ellipse([-140 * S, 360 * S, 520 * S, 560 * S], fill=(120, 100, 210, 70))
cd.ellipse([760 * S, 420 * S, 1380 * S, 640 * S], fill=(255, 126, 182, 46))
cd.ellipse([380 * S, 120 * S, 760 * S, 230 * S], fill=(120, 100, 210, 34))
img = Image.alpha_composite(img, clouds.filter(ImageFilter.GaussianBlur(46 * S)))

# moon glow: a warm halo added with a screen blend, so it lights the sky instead of greying it
mx, my, mr = 1010, 150, 82
halo = Image.new('RGB', (W * S, H * S), (0, 0, 0))
hd = ImageDraw.Draw(halo)
hd.ellipse(box(mx, my, 250), fill=(30, 30, 62))
hd.ellipse(box(mx, my, 140), fill=(66, 62, 104))
halo = halo.filter(ImageFilter.GaussianBlur(52 * S))
img = ImageChops.screen(img.convert('RGB'), halo).convert('RGBA')

# stars: a fine field, then a few bright ones with a glow
stars = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
sd = ImageDraw.Draw(stars)
for _ in range(260):
    x, y = random.randint(0, W), random.randint(0, int(H * 0.92))
    r = random.choice([0.7, 0.9, 0.9, 1.1, 1.4])
    sd.ellipse(box(x, y, r), fill=(255, 255, 255, random.randint(110, 235)))
img = Image.alpha_composite(img, stars)
bright = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
bd = ImageDraw.Draw(bright)
for (x, y) in [(120, 90), (330, 170), (560, 60), (760, 210), (890, 70), (1130, 330), (210, 470), (640, 330), (1090, 520)]:
    col = (246, 215, 122, 255) if random.random() < 0.25 else (255, 255, 255, 255)
    bd.ellipse(box(x, y, random.choice([2.0, 2.4, 2.8])), fill=col)
glow = bright.filter(ImageFilter.GaussianBlur(7 * S))
img = Image.alpha_composite(img, glow)
img = Image.alpha_composite(img, glow)
img = Image.alpha_composite(img, bright)

moon = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
md = ImageDraw.Draw(moon)
md.ellipse(box(mx, my, mr), fill=(247, 239, 198, 255))
for (cx, cy, cr) in [(-26, -22, 15), (22, 12, 21), (-8, 40, 10)]:
    md.ellipse(box(mx + cx, my + cy, cr), fill=(214, 205, 160, 255))
img = Image.alpha_composite(img, moon)
img.convert('RGB').resize((W, H), Image.LANCZOS).save('src/og/background.png', optimize=True)

# check badge, drawn 4x and scaled down for smooth edges
BS = 4
N = 168 * BS
badge = Image.new('RGBA', (N, N), (0, 0, 0, 0))
grad = Image.new('RGBA', (N, N))
gp = grad.load()
c0, c1 = (201, 44, 117), (106, 69, 230)
for y in range(N):
    for x in range(N):
        t = (x + y) / (2 * N)
        gp[x, y] = (*lerp(c0, c1, t), 255)
mask = Image.new('L', (N, N), 0)
ImageDraw.Draw(mask).ellipse([0, 0, N - 1, N - 1], fill=255)
badge.paste(grad, (0, 0), mask)
bdraw = ImageDraw.Draw(badge)
pts = [(N * 0.27, N * 0.52), (N * 0.43, N * 0.67), (N * 0.74, N * 0.35)]
bdraw.line(pts, fill=(255, 255, 255, 255), width=int(N * 0.085), joint='curve')
for p in (pts[0], pts[-1]):
    r = N * 0.085 / 2
    bdraw.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=(255, 255, 255, 255))
badge.resize((168, 168), Image.LANCZOS).save('src/og/badge.png')
print('wrote src/og/background.png and src/og/badge.png')

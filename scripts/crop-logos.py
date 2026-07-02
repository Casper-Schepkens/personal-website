from PIL import Image
import numpy as np
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE, "public", "images")


def find_logo_square(path, region=None, bg_threshold=15, padding=1.06):
    img = Image.open(path).convert("RGBA")
    arr = np.array(img)
    h, w = arr.shape[:2]

    x0, y0, x1, y1 = region or (0, 0, w, h)
    crop = arr[y0:y1, x0:x1]

    corners = np.concatenate([
        crop[0:50, 0:50].reshape(-1, 4),
        crop[0:50, -50:].reshape(-1, 4),
        crop[-50:, 0:50].reshape(-1, 4),
        crop[-50:, -50:].reshape(-1, 4),
    ])
    bg = np.median(corners[:, :3], axis=0)

    rgb = crop[:, :, :3].astype(float)
    diff = np.sqrt(np.sum((rgb - bg) ** 2, axis=2))
    mask = diff > bg_threshold

    ys, xs = np.where(mask)
    if len(xs) == 0:
        raise ValueError(f"No logo content found in {path}")

    min_x, max_x = xs.min() + x0, xs.max() + x0
    min_y, max_y = ys.min() + y0, ys.max() + y0

    cx = (min_x + max_x) / 2
    cy = (min_y + max_y) / 2
    size = max(max_x - min_x, max_y - min_y) * padding

    half = size / 2
    left = int(round(cx - half))
    top = int(round(cy - half))
    right = int(round(cx + half))
    bottom = int(round(cy + half))

    if left < 0:
        right -= left
        left = 0
    if top < 0:
        bottom -= top
        top = 0
    if right > w:
        left -= right - w
        right = w
    if bottom > h:
        top -= bottom - h
        bottom = h

    left = max(0, left)
    top = max(0, top)
    side = min(right - left, bottom - top)

    return left, top, left + side, top + side


def crop_and_save(src, dst, region=None, size=512, bg_threshold=15, padding=1.06):
    box = find_logo_square(src, region=region, bg_threshold=bg_threshold, padding=padding)
    img = Image.open(src).convert("RGBA")
    cropped = img.crop(box).resize((size, size), Image.Resampling.LANCZOS)
    cropped.save(dst, optimize=True)
    print(f"Saved {dst} from {box}")


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)

    # Light: CS monogram on left of business card (exclude name/contact)
    crop_and_save(
        os.path.join(BASE, "resources", "1.png"),
        os.path.join(OUT_DIR, "logo.png"),
        region=(0, 0, 1050, 1949),
        size=512,
        bg_threshold=12,
        padding=1.08,
    )

    # Dark: explicit bounds from monogram in 2.png (y bottom ~959)
    dark_path = os.path.join(BASE, "resources", "2.png")
    dark_box = find_logo_square(
        dark_path,
        region=(550, 80, 2460, 970),
        bg_threshold=14,
        padding=1.22,
    )
    dark_img = Image.open(dark_path)
    cropped = dark_img.crop(dark_box).resize((512, 512), Image.Resampling.LANCZOS)
    cropped.save(os.path.join(OUT_DIR, "logo-dark.png"), optimize=True)
    print(f"Saved logo-dark.png from {dark_box}")

from PIL import Image
import numpy as np

path = r"C:\Users\casper.schepkens\Desktop\personal website\resources\2.png"
img = Image.open(path).convert("RGBA")
arr = np.array(img)
h, w = arr.shape[:2]

# Only monogram area — stop well before name text
y1 = 900
region = arr[80:y1, 550:2460]
corners = np.concatenate([
    region[0:30, 0:30].reshape(-1, 4),
    region[0:30, -30:].reshape(-1, 4),
    region[-30:, 0:30].reshape(-1, 4),
    region[-30:, -30:].reshape(-1, 4),
])
bg = np.median(corners[:, :3], axis=0)
diff = np.sqrt(np.sum((region[:, :, :3].astype(float) - bg) ** 2, axis=2))
mask = diff > 16
ys, xs = np.where(mask)
print("bbox in region:", xs.min(), xs.max(), ys.min(), ys.max())
print("size w,h:", xs.max()-xs.min(), ys.max()-ys.min())
print("full coords:", xs.min()+550, xs.max()+550, ys.min()+80, ys.max()+80)
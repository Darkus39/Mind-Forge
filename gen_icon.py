#!/usr/bin/env python3
"""Generate a placeholder icon for MindForge. Replace with your own 1024x1024 PNG."""
import struct, zlib, math

def make_png(w, h, pixels_rgb):
    def chunk(name, data):
        c = struct.pack('>I', len(data)) + name + data
        return c + struct.pack('>I', zlib.crc32(name + data) & 0xffffffff)
    raw = b''.join(b'\x00' + bytes(pixels_rgb[y*w*3:(y+1)*w*3]) for y in range(h))
    return b'\x89PNG\r\n\x1a\n' + \
           chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)) + \
           chunk(b'IDAT', zlib.compress(raw, 9)) + \
           chunk(b'IEND', b'')

size = 192
pixels = []
cx, cy = size//2, size//2
for y in range(size):
    for x in range(size):
        dx, dy = x - cx, y - cy
        dist = math.sqrt(dx*dx + dy*dy)
        # Dark background
        r, g, b = 10, 10, 15
        # Rounded square feel — dark BG
        if dist < size * 0.46:
            r, g, b = 17, 17, 24
        # Cyan ring
        if abs(dist - size*0.38) < size*0.04:
            t = 1 - abs(dist - size*0.38) / (size*0.04)
            r = int(r + t * (0 - r))
            g = int(g + t * (229 - g))
            b = int(b + t * (255 - b))
        # Lightning bolt (simplified)
        if abs(x - cx + dy*0.2) < size*0.05 and dist < size*0.28:
            r, g, b = 0, 229, 255
        pixels.extend([r, g, b])

with open('res/icon/icon.png', 'wb') as f:
    f.write(make_png(size, size, pixels))
print(f"Generated {size}x{size} icon → res/icon/icon.png")
print("Replace with your own 1024×1024 PNG for production.")

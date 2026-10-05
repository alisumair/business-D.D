import os
import zlib
import struct
import math

def create_png(width, height, draw_func, filename):
    # PNG signature
    png = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png += struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # Image raw scanlines
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # Filter type 0 (None)
        for x in range(width):
            r, g, b, a = draw_func(x, y, width, height)
            raw_data.extend([r, g, b, a])
            
    # Compress IDAT
    compressed = zlib.compress(bytes(raw_data), 9)
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png += struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    png += struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'wb') as f:
        f.write(png)
    print(f"Generated {filename}")

def draw_standard_icon(x, y, w, h):
    # Normalized coords [0, 1]
    nx = x / w
    ny = y / h
    
    # Deep emerald gradient
    r0, g0, b0 = (6, 40, 30)
    r1, g1, b1 = (11, 60, 44)
    factor = (nx + ny) / 2.0
    r = int(r0 + (r1 - r0) * factor)
    g = int(g0 + (g1 - g0) * factor)
    b = int(b0 + (b1 - b0) * factor)
    a = 255
    
    # Rounded corners for non-maskable
    cx = abs(nx - 0.5) * 2
    cy = abs(ny - 0.5) * 2
    # Check rounded rectangle
    radius = 0.22
    if cx > 1 - radius and cy > 1 - radius:
        dist = math.hypot(cx - (1 - radius), cy - (1 - radius))
        if dist > radius:
            return (0, 0, 0, 0)
            
    # Store front outline in center
    # Center box [0.28, 0.72] in x, [0.35, 0.65] in y
    if 0.28 <= nx <= 0.72 and 0.40 <= ny <= 0.65:
        # Shop white wall
        if 0.45 <= nx <= 0.55 and 0.48 <= ny <= 0.65:
            # Door
            return (6, 40, 30, 255)
        elif (0.33 <= nx <= 0.41 and 0.46 <= ny <= 0.58) or (0.59 <= nx <= 0.67 and 0.46 <= ny <= 0.58):
            # Windows (sky blue)
            return (56, 189, 248, 255)
        else:
            return (248, 250, 252, 255)
            
    # Canopy awning [0.24, 0.76] in x, [0.28, 0.40] in y (Neon Lime)
    if 0.24 <= nx <= 0.76 and 0.28 <= ny <= 0.40:
        return (0, 210, 106, 255)

    # Accent badge circle at [0.70, 0.32]
    d_badge = math.hypot(nx - 0.70, ny - 0.32)
    if d_badge < 0.08:
        return (0, 210, 106, 255)
        
    return (r, g, b, a)

def draw_maskable_icon(x, y, w, h):
    # Full bleed background for Android maskable (no transparent borders)
    nx = x / w
    ny = y / h
    
    r0, g0, b0 = (6, 40, 30)
    r1, g1, b1 = (11, 60, 44)
    factor = (nx + ny) / 2.0
    r = int(r0 + (r1 - r0) * factor)
    g = int(g0 + (g1 - g0) * factor)
    b = int(b0 + (b1 - b0) * factor)
    
    # Storefront kept strictly within safe 80% inner circle (radius 0.35 from center)
    if 0.30 <= nx <= 0.70 and 0.42 <= ny <= 0.64:
        if 0.45 <= nx <= 0.55 and 0.50 <= ny <= 0.64:
            return (6, 40, 30, 255)
        elif (0.34 <= nx <= 0.42 and 0.48 <= ny <= 0.58) or (0.58 <= nx <= 0.66 and 0.48 <= ny <= 0.58):
            return (56, 189, 248, 255)
        else:
            return (248, 250, 252, 255)
            
    # Canopy awning
    if 0.28 <= nx <= 0.72 and 0.30 <= ny <= 0.42:
        return (0, 210, 106, 255)
        
    d_badge = math.hypot(nx - 0.68, ny - 0.32)
    if d_badge < 0.07:
        return (0, 210, 106, 255)
        
    return (r, g, b, 255)

if __name__ == '__main__':
    create_png(192, 192, draw_standard_icon, 'public/pwa-192x192.png')
    create_png(512, 512, draw_standard_icon, 'public/pwa-512x512.png')
    create_png(180, 180, draw_standard_icon, 'public/apple-touch-icon.png')
    create_png(512, 512, draw_maskable_icon, 'public/pwa-maskable-512x512.png')
    # Also copy 192x192 as favicon.ico (PNG inside ico format is valid in modern browsers)
    with open('public/pwa-192x192.png', 'rb') as src, open('public/favicon.ico', 'wb') as dst:
        dst.write(src.read())
    print("All PWA & Apple icons created successfully.")

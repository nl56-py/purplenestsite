import os
from PIL import Image, ImageDraw, ImageFilter

def make_clear_hero():
    w, h = 1920, 1080
    print("Creating clear, high-fidelity 16:9 hero background...")

    # 1. Base canvas
    comp = Image.new('RGBA', (w, h), (26, 8, 42, 255))

    # 2. Left side: Authentic hostel building photo
    # Use hero-exterior.jpg (or block-a.jpg) with natural warmth and clarity
    ext_path = 'public/images/hero-exterior.jpg'
    if not os.path.exists(ext_path):
        ext_path = 'public/images/block-a.jpg'
    
    ext_raw = Image.open(ext_path).convert('RGBA')
    ew, eh = ext_raw.size
    # Scale to cover left half and more (width ~ 1250, height = 1080)
    scale = max(1250.0 / ew, float(h) / eh)
    ext_scaled = ext_raw.resize((int(ew * scale), int(eh * scale)), Image.Resampling.LANCZOS)
    
    # Crop to 1250 x 1080
    ext_crop = ext_scaled.crop((0, 0, 1250, h))
    
    # 3. Right side: The 3D Hoarding Board Photo
    board_path = 'public/images/the purple nest 3d1.jpg.jpeg'
    board_raw = Image.open(board_path).convert('RGBA')
    
    # Scale board to 1020x1020 so the 3D logo is crisp and majestic
    board_sz = 1020
    board_fit = board_raw.resize((board_sz, board_sz), Image.Resampling.LANCZOS)
    
    # Right side wall background (match the light board wall color #ECECEC)
    right_w = 1050
    right_canvas = Image.new('RGBA', (right_w, h), (236, 236, 236, 255))
    
    # Paste board onto right canvas with elegant centering
    paste_x = (right_w - board_sz) // 2
    paste_y = (h - board_sz) // 2
    right_canvas.paste(board_fit, (paste_x, paste_y))
    
    # Paste building on the left
    comp.paste(ext_crop, (0, 0))
    
    # Blend right canvas over comp with a smooth gradient transition mask from x=780 to x=1050
    mask = Image.new('L', (w, h), 0)
    m_draw = ImageDraw.Draw(mask)
    blend_start = 780
    blend_end = 1040
    for x in range(blend_start, blend_end):
        ratio = (x - blend_start) / float(blend_end - blend_start)
        # S-curve for silky smooth gradient
        smooth_ratio = ratio * ratio * (3 - 2 * ratio)
        alpha = int(255 * smooth_ratio)
        m_draw.line([(x, 0), (x, h)], fill=alpha)
    m_draw.rectangle([blend_end, 0, w, h], fill=255)
    
    # Paste right canvas using mask
    right_full = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    right_full.paste(right_canvas, (w - right_w, 0))
    
    comp = Image.composite(right_full, comp, mask)
    
    # Add an ultra-subtle atmospheric tone mapping so left and right feel cohesive
    # Darken slightly on the left for text contrast, but keep building CLEAR and visible
    vignette = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for x in range(0, 950):
        # Fade from 90 (left) down to 0 (center)
        ratio = 1.0 - (x / 950.0)
        alpha = int(95 * ratio)
        v_draw.line([(x, 0), (x, h)], fill=(18, 6, 28, alpha))
    
    comp = Image.alpha_composite(comp, vignette)
    
    # Save output
    out_rgb = comp.convert('RGB')
    out_path = 'public/images/hero-hoarding-16-9-desktop.jpg'
    out_rgb.save(out_path, quality=95)
    print(f"[OK] Successfully generated {out_path} ({w}x{h})")

if __name__ == '__main__':
    make_clear_hero()

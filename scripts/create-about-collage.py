import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = r"D:\pnsite"
PUBLIC_IMAGES = os.path.join(BASE_DIR, "public", "images")

def build_about_assets():
    print("Building About assets...")
    
    # 1. Generate 3D Banner
    board_path = os.path.join(BASE_DIR, "the purple nest 3d1.jpg.jpeg")
    board = Image.open(board_path).convert("RGB")
    
    # Crop centered 16:9 around logo
    crop_w, crop_h = 1000, 562
    cx, cy = 585, 622
    x1 = max(0, cx - crop_w // 2)
    y1 = max(0, cy - crop_h // 2)
    x2 = x1 + crop_w
    y2 = y1 + crop_h
    
    crop_3d = board.crop((x1, y1, x2, y2))
    banner_path = os.path.join(PUBLIC_IMAGES, "the-purple-nest-3d-banner.jpg")
    crop_3d.save(banner_path, quality=95)
    print(f"Saved {banner_path}")
    
    # 2. Build Master Collage (1200 x 1300)
    cw, ch = 1200, 1300
    canvas = Image.new("RGB", (cw, ch), (248, 245, 239))
    draw = ImageDraw.Draw(canvas)
    
    # Top Card: 3D Logo Banner
    top_w, top_h = 1140, 580
    logo_fit = crop_3d.resize((top_w, top_h), Image.Resampling.LANCZOS)
    
    # Gradient overlay at bottom
    logo_rgba = logo_fit.convert("RGBA")
    grad = Image.new("RGBA", (top_w, top_h), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grad)
    for y in range(top_h - 130, top_h):
        alpha = int(140 * ((y - (top_h - 130)) / 130.0))
        g_draw.line([(0, y), (top_w, y)], fill=(20, 6, 32, alpha))
    logo_comp = Image.alpha_composite(logo_rgba, grad)
    
    t_mask = Image.new("L", (top_w, top_h), 0)
    ImageDraw.Draw(t_mask).rounded_rectangle([0, 0, top_w, top_h], radius=24, fill=255)
    canvas.paste(logo_comp.convert("RGB"), (30, 30), t_mask)
    draw.rounded_rectangle([30, 30, 30 + top_w, 30 + top_h], radius=24, outline=(220, 214, 202), width=2)
    
    # Bottom Left: Block A
    b_w, b_h = 555, 630
    ba_path = os.path.join(PUBLIC_IMAGES, "block-a.jpg")
    ba_src = Image.open(ba_path).convert("RGB")
    ba_crop = ba_src.crop((0, 80, ba_src.width, int(ba_src.width * (b_h / b_w) + 80)))
    ba_fit = ba_crop.resize((b_w, b_h), Image.Resampling.LANCZOS)
    
    ba_rgba = ba_fit.convert("RGBA")
    grad_ba = Image.new("RGBA", (b_w, b_h), (0, 0, 0, 0))
    gba_draw = ImageDraw.Draw(grad_ba)
    for y in range(b_h - 150, b_h):
        alpha = int(180 * ((y - (b_h - 150)) / 150.0))
        gba_draw.line([(0, y), (b_w, y)], fill=(15, 8, 24, alpha))
    ba_comp = Image.alpha_composite(ba_rgba, grad_ba)
    
    ba_mask = Image.new("L", (b_w, b_h), 0)
    ImageDraw.Draw(ba_mask).rounded_rectangle([0, 0, b_w, b_h], radius=24, fill=255)
    canvas.paste(ba_comp.convert("RGB"), (30, 640), ba_mask)
    draw.rounded_rectangle([30, 640, 30 + b_w, 640 + b_h], radius=24, outline=(220, 214, 202), width=2)
    
    # Bottom Right: Block B
    bb_path = os.path.join(PUBLIC_IMAGES, "block-b.jpg")
    bb_src = Image.open(bb_path).convert("RGB")
    bb_crop = bb_src.crop((0, 50, bb_src.width, int(bb_src.width * (b_h / b_w) + 50)))
    bb_fit = bb_crop.resize((b_w, b_h), Image.Resampling.LANCZOS)
    
    bb_rgba = bb_fit.convert("RGBA")
    grad_bb = Image.new("RGBA", (b_w, b_h), (0, 0, 0, 0))
    gbb_draw = ImageDraw.Draw(grad_bb)
    for y in range(b_h - 150, b_h):
        alpha = int(180 * ((y - (b_h - 150)) / 150.0))
        gbb_draw.line([(0, y), (b_w, y)], fill=(15, 8, 24, alpha))
    bb_comp = Image.alpha_composite(bb_rgba, grad_bb)
    
    bb_mask = Image.new("L", (b_w, b_h), 0)
    ImageDraw.Draw(bb_mask).rounded_rectangle([0, 0, b_w, b_h], radius=24, fill=255)
    canvas.paste(bb_comp.convert("RGB"), (615, 640), bb_mask)
    draw.rounded_rectangle([615, 640, 615 + b_w, 640 + b_h], radius=24, outline=(220, 214, 202), width=2)
    
    # Save master collage
    collage_path = os.path.join(PUBLIC_IMAGES, "about-building-sites-collage.jpg")
    canvas.save(collage_path, quality=95)
    print(f"Saved {collage_path}")

if __name__ == "__main__":
    build_about_assets()

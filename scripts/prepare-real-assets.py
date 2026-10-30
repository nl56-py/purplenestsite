import os
from PIL import Image, ImageDraw, ImageFilter

def process_assets():
    os.makedirs('public/images', exist_ok=True)
    print("Processing real assets...")

    # 1. Official Logo - Transparent PNG (512x512 and 192x192)
    raw_icon = Image.open('public/images/the purple nest icon.jpg.jpeg').convert('RGBA')
    # Bounding box is around (1570, 1530, 2930, 2970)
    cropped_icon = raw_icon.crop((1570, 1530, 2930, 2970))
    datas = cropped_icon.getdata()
    cleaned_data = []
    for p in datas:
        r, g, b = p[0], p[1], p[2]
        if r > 245 and g > 245 and b > 245:
            cleaned_data.append((255, 255, 255, 0))
        elif r > 225 and g > 225 and b > 225:
            alpha = int(255 * (1 - (min(r, g, b) - 225) / 30.0))
            cleaned_data.append((r, g, b, alpha))
        else:
            cleaned_data.append(p)
    cropped_icon.putdata(cleaned_data)

    max_dim = max(cropped_icon.size)
    sq_icon = Image.new('RGBA', (max_dim, max_dim), (255, 255, 255, 0))
    sq_icon.paste(cropped_icon, ((max_dim - cropped_icon.width) // 2, (max_dim - cropped_icon.height) // 2))

    icon_512 = sq_icon.resize((512, 512), Image.Resampling.LANCZOS)
    icon_512.save('public/images/purple-nest-logo.png', 'PNG')
    icon_512.save('public/images/logo.png', 'PNG')
    print("[OK] Saved purple-nest-logo.png and logo.png")

    icon_192 = sq_icon.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save('public/images/icon-192.png', 'PNG')

    # Also keep high-res JPEG version
    sq_icon_white = Image.new('RGB', (max_dim, max_dim), (255, 255, 255))
    sq_icon_white.paste(cropped_icon, ((max_dim - cropped_icon.width) // 2, (max_dim - cropped_icon.height) // 2), cropped_icon)
    icon_white_512 = sq_icon_white.resize((512, 512), Image.Resampling.LANCZOS)
    icon_white_512.save('public/images/purple-nest-icon.jpg', quality=95)
    icon_white_512.save('public/images/logo.jpg', quality=95)
    print("[OK] Saved purple-nest-icon.jpg")

    # 2. 16:9 Version of Real 3D Hoarding Board Photo
    # Source: public/images/the purple nest 3d1.jpg.jpeg (1200x1200)
    raw_board = Image.open('public/images/the purple nest 3d1.jpg.jpeg').convert('RGB')
    target_w, target_h = 1920, 1080
    bg_color = (236, 236, 236) # exact wall color

    canvas_16_9 = Image.new('RGB', (target_w, target_h), bg_color)
    # Resize 1200x1200 to 1080x1080 so the 3D logo is prominently visible
    board_fit = raw_board.resize((1080, 1080), Image.Resampling.LANCZOS)
    paste_x = (target_w - 1080) // 2
    paste_y = (target_h - 1080) // 2
    canvas_16_9.paste(board_fit, (paste_x, paste_y))
    canvas_16_9.save('public/images/purple-nest-hoarding-16-9.jpg', quality=95)
    canvas_16_9.save('public/images/hero-hoarding-16-9.jpg', quality=95)
    print("[OK] Saved purple-nest-hoarding-16-9.jpg & hero-hoarding-16-9.jpg")

    # 3. Block A (Real photo)
    raw_a = Image.open('public/images/block A.jpeg').convert('RGB')
    raw_a.save('public/images/block-a-real.jpg', quality=95)
    raw_a.save('public/images/block-a.jpg', quality=95)
    print("[OK] Saved block-a-real.jpg & block-a.jpg")

    # 4. Block B (Real photo + branded with 3D Purple Nest signboard over old sign)
    raw_b = Image.open('public/images/Block B.jpeg').convert('RGB')
    raw_b.save('public/images/block-b-real.jpg', quality=95)

    # Extract 3D logo crop
    crop_3d = raw_board.crop((190, 320, 940, 940)) # 750x620
    
    # Create realistic sign for Block B center sign
    # Center sign coords: x=460, y=928, width=152, height=92
    sign_w, sign_h = 152, 92
    sign_face = Image.new('RGBA', (sign_w, sign_h), (0, 0, 0, 0))
    draw_sign = ImageDraw.Draw(sign_face)
    # Sleek acrylic board: subtle off-white background with dark royal purple border and inner gold pinstripe
    draw_sign.rounded_rectangle([2, 2, sign_w - 3, sign_h - 3], radius=6, fill=(244, 244, 248, 255), outline=(67, 16, 108, 255), width=3)
    draw_sign.rounded_rectangle([5, 5, sign_w - 6, sign_h - 6], radius=4, outline=(218, 165, 32, 220), width=1)
    
    logo_for_sign = crop_3d.resize((sign_w - 18, sign_h - 16), Image.Resampling.LANCZOS)
    sign_face.paste(logo_for_sign, (9, 7))

    b_branded = raw_b.convert('RGBA')
    b_branded.paste(sign_face, (460, 928), sign_face)

    # Right hanging sign cover (x=895..955, y=915..1080)
    col_w, col_h = 56, 165
    col_sign = Image.new('RGBA', (col_w, col_h), (0, 0, 0, 0))
    col_draw = ImageDraw.Draw(col_sign)
    col_draw.rounded_rectangle([2, 2, col_w - 3, col_h - 3], radius=4, fill=(67, 16, 108, 255), outline=(218, 165, 32, 255), width=2)
    mini_logo = icon_512.resize((44, 44), Image.Resampling.LANCZOS)
    col_sign.paste(mini_logo, (6, 10), mini_logo)
    b_branded.paste(col_sign, (896, 918), col_sign)

    b_branded_rgb = b_branded.convert('RGB')
    b_branded_rgb.save('public/images/block-b.jpg', quality=95)
    b_branded_rgb.save('public/images/block-b-branded.jpg', quality=95)
    print("[OK] Saved block-b.jpg (with Purple Nest 3D signboard) & block-b-branded.jpg")

    # 5. Create a 16:9 composite hero slide featuring the real buildings and 3D hoarding board
    # 1920x1080 dual-block panoramic showcase
    hero_canvas = Image.new('RGB', (1920, 1080), (28, 10, 48))
    # Left side: Block A real photo (scaled to fit half height)
    # Right side: Block B branded photo
    # Center: 3D Hoarding board crest
    print("Assets processed successfully!")

if __name__ == '__main__':
    process_assets()

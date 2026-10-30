import os
import base64
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def extract_alpha(img):
    img = img.convert('RGB')
    w, h = img.size
    out = Image.new('RGBA', (w, h))
    pixels_in = img.load()
    pixels_out = out.load()
    
    for y in range(h):
        for x in range(w):
            r, g, b = pixels_in[x, y]
            dr = 255 - r
            dg = 255 - g
            db = 255 - b
            max_d = max(dr, dg, db)
            
            if max_d <= 4:
                pixels_out[x, y] = (255, 255, 255, 0)
            else:
                alpha = min(255, int((max_d / 245.0) * 255))
                a_float = alpha / 255.0
                cr = min(255, max(0, int((r - 255 * (1 - a_float)) / a_float)))
                cg = min(255, max(0, int((g - 255 * (1 - a_float)) / a_float)))
                cb = min(255, max(0, int((b - 255 * (1 - a_float)) / a_float)))
                pixels_out[x, y] = (cr, cg, cb, alpha)
    return out

def generate_all():
    os.makedirs('public/images', exist_ok=True)
    os.makedirs('src/app', exist_ok=True)
    print("Generating official Purple Nest Favicons, App Icons, Metadata & OG Images...")

    src_icon_path = 'public/images/the purple nest icon.jpg.jpeg'
    if not os.path.exists(src_icon_path):
        src_icon_path = 'the purple nest icon.jpg.jpeg'

    raw_icon = Image.open(src_icon_path)
    crop_emblem = raw_icon.crop((1610, 1560, 2890, 2940))
    emblem_rgba = extract_alpha(crop_emblem)

    # 1. Square transparent master logo
    max_d = max(emblem_rgba.size)
    sq_logo = Image.new('RGBA', (max_d, max_d), (0, 0, 0, 0))
    sq_logo.paste(emblem_rgba, ((max_d - emblem_rgba.width) // 2, (max_d - emblem_rgba.height) // 2))

    # Save 512x512 transparent logo
    logo_512 = sq_logo.resize((512, 512), Image.Resampling.LANCZOS)
    logo_512.save('public/images/logo.png', 'PNG')
    logo_512.save('public/images/purple-nest-logo.png', 'PNG')
    print("[OK] Saved transparent logos: public/images/logo.png & purple-nest-logo.png")

    # 2. Master Medal Badge for Favicons & App Icons (512x512)
    size = 512
    badge = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(badge)
    bdraw.rounded_rectangle([16, 16, size - 16, size - 16], radius=110, fill=(67, 16, 108, 255), outline=(218, 165, 32, 220), width=8)
    margin = 44
    bdraw.ellipse([margin, margin, size - margin, size - margin], fill=(255, 255, 255, 255), outline=(218, 165, 32, 180), width=4)
    emblem_sz = 310
    emblem_fit = sq_logo.resize((emblem_sz, emblem_sz), Image.Resampling.LANCZOS)
    badge.paste(emblem_fit, ((size - emblem_sz) // 2, (size - emblem_sz) // 2), emblem_fit)

    # 3. Standard Favicon PNGs
    badge.resize((16, 16), Image.Resampling.LANCZOS).save('public/favicon-16x16.png')
    badge.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32x32.png')
    badge.resize((48, 48), Image.Resampling.LANCZOS).save('public/favicon-48x48.png')
    print("[OK] Saved favicon-16x16.png, favicon-32x32.png, favicon-48x48.png")

    # 4. Multi-resolution favicon.ico (16, 32, 48)
    badge.save('public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
    badge.save('src/app/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
    print("[OK] Saved multi-resolution favicon.ico to public/ and src/app/")

    # 5. Apple Touch Icons (180x180)
    apple_180 = badge.resize((180, 180), Image.Resampling.LANCZOS)
    apple_180.save('public/apple-touch-icon.png')
    apple_180.save('public/apple-touch-icon-precomposed.png')
    apple_180.save('src/app/apple-icon.png')
    print("[OK] Saved Apple Touch Icons (180x180)")

    # 6. Android Chrome & PWA Icons (192x192 & 512x512)
    badge_192 = badge.resize((192, 192), Image.Resampling.LANCZOS)
    badge_192.save('public/android-chrome-192x192.png')
    badge_192.save('public/images/icon-192.png')

    badge_512 = badge.resize((512, 512), Image.Resampling.LANCZOS)
    badge_512.save('public/android-chrome-512x512.png')
    badge_512.save('public/images/icon-512.png')
    badge_512.save('src/app/icon.png')
    print("[OK] Saved Android Chrome & PWA Manifest icons")

    # 7. Scalable SVG Icons (with base64 embedded high-res PNG)
    with open('src/app/icon.png', 'rb') as f:
        b64_png = base64.b64encode(f.read()).decode('utf-8')
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,{b64_png}" width="512" height="512" />
</svg>
'''
    with open('src/app/icon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    with open('public/icon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    with open('public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print("[OK] Saved vector SVG icons to src/app/icon.svg and public/")

    # 8. High-Fidelity Open Graph (OG) Image (1200x630)
    w, h = 1200, 630
    og_base = Image.new('RGBA', (w, h), (24, 5, 38, 255))
    og_draw = ImageDraw.Draw(og_base)
    for y in range(h):
        ratio = y / float(h)
        r = int(52 - ratio * 30)
        g = int(12 - ratio * 7)
        b = int(86 - ratio * 50)
        og_draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    glow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([-50, -50, 550, 550], fill=(115, 30, 185, 75))
    gdraw.ellipse([700, 50, 1300, 650], fill=(85, 20, 140, 65))
    gdraw.ellipse([400, 200, 800, 600], fill=(67, 16, 108, 45))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    og_base = Image.alpha_composite(og_base, glow)

    # Decorative gold frame
    fdraw = ImageDraw.Draw(og_base)
    fdraw.rectangle([14, 14, w - 15, h - 15], outline=(218, 165, 32, 90), width=1)
    fdraw.rectangle([18, 18, w - 19, h - 19], outline=(218, 165, 32, 160), width=2)
    for cx, cy in [(18, 18), (w - 18, 18), (18, h - 18), (w - 18, h - 18)]:
        fdraw.rectangle([cx - 4, cy - 4, cx + 4, cy + 4], fill=(218, 165, 32, 255))

    # Add real building showcase cards on right side
    card_w, card_h = 440, 245
    if os.path.exists('public/images/block-a-real.jpg') and os.path.exists('public/images/block-b.jpg'):
        photo_a = Image.open('public/images/block-a-real.jpg').convert('RGBA')
        photo_b = Image.open('public/images/block-b.jpg').convert('RGBA')

        def make_card(photo, badge_text):
            cw, ch = card_w, card_h
            pw, ph = photo.size
            scale = max(cw / pw, ch / ph)
            scaled = photo.resize((int(pw * scale), int(ph * scale)), Image.Resampling.LANCZOS)
            x_off = (scaled.width - cw) // 2
            y_off = (scaled.height - ch) // 2
            cropped = scaled.crop((x_off, y_off, x_off + cw, y_off + ch))
            
            card = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
            mask = Image.new('L', (cw, ch), 0)
            ImageDraw.Draw(mask).rounded_rectangle([0, 0, cw, ch], radius=16, fill=255)
            card.paste(cropped, (0, 0), mask)

            grad = Image.new('RGBA', (cw, ch), (0,0,0,0))
            g_d = ImageDraw.Draw(grad)
            for gy in range(ch - 70, ch):
                alpha = int(180 * (gy - (ch - 70)) / 70.0)
                g_d.line([(0, gy), (cw, gy)], fill=(15, 3, 25, alpha))
            card = Image.alpha_composite(card, grad)

            cdraw = ImageDraw.Draw(card)
            cdraw.rounded_rectangle([0, 0, cw - 1, ch - 1], radius=16, outline=(218, 165, 32, 220), width=3)
            cdraw.rounded_rectangle([3, 3, cw - 4, ch - 4], radius=14, outline=(0, 0, 0, 100), width=1)
            
            pill_w = 160
            cdraw.rounded_rectangle([14, ch - 44, 14 + pill_w, ch - 14], radius=8, fill=(35, 8, 55, 230), outline=(218, 165, 32, 220), width=2)
            try:
                font_pill = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 15)
                cdraw.text((26, ch - 39), badge_text, fill=(255, 255, 255, 255), font=font_pill)
            except Exception:
                pass
            return card

        card1 = make_card(photo_a, 'BLOCK A • Sinpa')
        card2 = make_card(photo_b, 'BLOCK B • Branded')

        def add_card_with_shadow(base_img, card, x, y):
            cw, ch = card.size
            shad = Image.new('RGBA', (cw + 24, ch + 24), (0,0,0,0))
            ImageDraw.Draw(shad).rounded_rectangle([12, 12, cw + 12, ch + 12], radius=18, fill=(0, 0, 0, 160))
            shad = shad.filter(ImageFilter.GaussianBlur(10))
            base_img.paste(shad, (x - 12, y - 12), shad)
            base_img.paste(card, (x, y), card)

        add_card_with_shadow(og_base, card1, 705, 52)
        add_card_with_shadow(og_base, card2, 705, 332)

    # Logo badge on left
    badge_sz = 148
    logo_resized = badge.resize((badge_sz, badge_sz), Image.Resampling.LANCZOS)
    l_shad = Image.new('RGBA', (badge_sz + 24, badge_sz + 24), (0,0,0,0))
    ImageDraw.Draw(l_shad).rounded_rectangle([12, 12, badge_sz + 12, badge_sz + 12], radius=32, fill=(0, 0, 0, 180))
    l_shad = l_shad.filter(ImageFilter.GaussianBlur(10))
    og_base.paste(l_shad, (46, 42), l_shad)
    og_base.paste(logo_resized, (58, 54), logo_resized)

    # Typography
    draw = ImageDraw.Draw(og_base)
    f_title = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 38)
    f_sub = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 18)
    f_body = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 16)
    f_badge = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 13)
    f_contact = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 17)

    # Admissions Open pill
    pill_x, pill_y = 228, 56
    draw.rounded_rectangle([pill_x, pill_y, pill_x + 205, pill_y + 28], radius=14, fill=(218, 165, 32, 255))
    draw.text((pill_x + 16, pill_y + 5), 'ADMISSIONS OPEN 2026', fill=(24, 5, 38), font=f_badge)

    draw.text((228, 92), 'THE PURPLE NEST', fill=(255, 255, 255), font=f_title)
    draw.text((228, 142), 'STUDENT HOSTEL  •  GWARKO, LALITPUR', fill=(218, 165, 32), font=f_sub)

    draw.line([(58, 222), (665, 222)], fill=(218, 165, 32, 120), width=2)
    draw.text((58, 238), 'Safe, clean & homely student stay across 3 dedicated blocks.', fill=(245, 240, 252), font=f_sub)

    features = [
        '• 3 Dedicated Blocks (Block A, B & C) in Gwarko',
        '• Single, Double, Triple & 4-Seater Rooms',
        '• 4 Fresh Daily Hygienic Meals + 24/7 Hot Water',
        '• Biometric Security & 24/7 CCTV Monitoring',
        '• Quiet Study Hall & High-Speed Wi-Fi',
        '• 2-Min Walk to Sinpa Marg, Gwarko Chowk & KMC'
    ]
    fy = 282
    for feat in features:
        draw.text((62, fy), feat, fill=(232, 226, 244), font=f_body)
        fy += 28

    box_x, box_y, box_w, box_h = 58, 478, 608, 86
    draw.rounded_rectangle([box_x, box_y, box_x + box_w, box_y + box_h], radius=14, fill=(38, 9, 60, 240), outline=(218, 165, 32, 220), width=2)
    draw.text((box_x + 20, box_y + 16), 'Call / WhatsApp: +977 976-1158651', fill=(255, 255, 255), font=f_contact)
    draw.text((box_x + 20, box_y + 48), 'thepurplenesthostel.com   •   Sinpa Marg, Gwarko, Lalitpur', fill=(218, 165, 32), font=f_body)

    out_rgb = og_base.convert('RGB')
    out_rgb.save('public/images/og-image.jpg', quality=94)
    og_base.save('public/images/og-image.png')
    og_base.save('src/app/opengraph-image.png')
    og_base.save('src/app/twitter-image.png')
    print("[OK] Saved 1200x630 OG and Twitter images")

    # 9. Square OG Image for WhatsApp & Messaging previews (600x600)
    sq_og = Image.new('RGB', (600, 600), (26, 6, 42))
    sq_draw = ImageDraw.Draw(sq_og)
    for y in range(600):
        ratio = y / 600.0
        r = int(50 - ratio * 28)
        g = int(12 - ratio * 7)
        b = int(82 - ratio * 46)
        sq_draw.line([(0, y), (600, y)], fill=(r, g, b))
    
    sq_draw.rectangle([10, 10, 589, 589], outline=(218, 165, 32, 160), width=2)
    b_290 = badge.resize((290, 290), Image.Resampling.LANCZOS)
    b_shad = Image.new('RGBA', (310, 310), (0,0,0,0))
    ImageDraw.Draw(b_shad).rounded_rectangle([10, 10, 300, 300], radius=50, fill=(0,0,0,160))
    b_shad = b_shad.filter(ImageFilter.GaussianBlur(10))
    sq_og.paste(b_shad, (145, 45), b_shad)
    sq_og.paste(b_290, (155, 55), b_290)

    f_t_sq = ImageFont.truetype('C:/Windows/Fonts/georgiab.ttf', 30)
    f_sub_sq = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 16)
    f_body_sq = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 14)
    f_bold_sq = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', 14)

    sq_draw.text((300, 385), 'THE PURPLE NEST', fill=(255, 255, 255), font=f_t_sq, anchor='mm')
    sq_draw.text((300, 420), 'STUDENT HOSTEL • GWARKO, LALITPUR', fill=(218, 165, 32), font=f_sub_sq, anchor='mm')
    sq_draw.text((300, 458), 'Safe, Clean & Homely Stay Across 3 Dedicated Blocks', fill=(240, 235, 248), font=f_body_sq, anchor='mm')
    sq_draw.text((300, 492), 'Single, Double, Triple & 4-Seater Rooms • 4 Meals Daily', fill=(225, 218, 238), font=f_body_sq, anchor='mm')
    
    sq_draw.rounded_rectangle([60, 525, 540, 565], radius=10, fill=(40, 10, 64), outline=(218, 165, 32, 220), width=1)
    sq_draw.text((300, 544), 'Call: +977 976-1158651  •  thepurplenesthostel.com', fill=(218, 165, 32), font=f_bold_sq, anchor='mm')
    sq_og.save('public/images/og-image-square.jpg', quality=95)
    print("[OK] Saved public/images/og-image-square.jpg (600x600)")

    print("All favicon, logo, metadata & OG image assets successfully generated!")

if __name__ == '__main__':
    generate_all()

import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('assets', exist_ok=True)

def create_aesthetic_dummy(width, height, title, subtitle, filename):
    img = Image.new('RGB', (width, height), color='#FFF8F6')
    draw = ImageDraw.Draw(img)
    
    # Gradient/warm background accents
    for y in range(height):
        ratio = y / height
        r = int(255 - (255 - 248) * ratio)
        g = int(248 - (248 - 221) * ratio)
        b = int(246 - (246 - 227) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # Outer & inner decorative frame
    margin = 35
    draw.rectangle([margin, margin, width - margin, height - margin], outline='#D9899A', width=3)
    draw.rectangle([margin + 8, margin + 8, width - margin - 8, height - margin - 8], outline='#F8DDE3', width=2)
    
    # Corner stars / sparkles
    star_offsets = [
        (margin + 25, margin + 25),
        (width - margin - 25, margin + 25),
        (margin + 25, height - margin - 25),
        (width - margin - 25, height - margin - 25)
    ]
    for sx, sy in star_offsets:
        draw.ellipse([sx - 6, sy - 6, sx + 6, sy + 6], fill='#D1AE70')
    
    # Center camera icon
    cx, cy = width // 2, height // 2 - 50
    # Camera body
    draw.rounded_rectangle([cx - 80, cy - 60, cx + 80, cy + 60], radius=16, fill='#FFF8F6', outline='#B85C73', width=4)
    # Lens outer
    draw.ellipse([cx - 36, cy - 36, cx + 36, cy + 36], fill='#FDF3F5', outline='#B85C73', width=4)
    # Lens inner
    draw.ellipse([cx - 18, cy - 18, cx + 18, cy + 18], fill='#D9899A')
    # Flash
    draw.rectangle([cx - 24, cy - 74, cx + 24, cy - 60], fill='#B85C73')
    draw.ellipse([cx + 45, cy - 40, cx + 55, cy - 30], fill='#D1AE70')
    
    # Text labels
    # Use load_default or try system fonts
    try:
        font_title = ImageFont.truetype('arial.ttf', 32)
        font_sub = ImageFont.truetype('arial.ttf', 24)
        font_note = ImageFont.truetype('arial.ttf', 20)
    except Exception:
        font_title = font_sub = font_note = ImageFont.load_default()
    
    draw.text((cx, cy + 105), title, fill='#49313D', font=font_title, anchor='mm')
    draw.text((cx, cy + 155), subtitle, fill='#B85C73', font=font_sub, anchor='mm')
    draw.text((cx, cy + 195), "Simply replace this file in the 'assets/' folder", fill='#7E636F', font=font_note, anchor='mm')
    draw.text((cx, cy + 225), "with Prisha's real photo!", fill='#7E636F', font=font_note, anchor='mm')
    
    img.save(filename, quality=95)
    print(f"Generated dummy placeholder: {filename}")

create_aesthetic_dummy(800, 1067, "PRISHA'S PHOTO", "assets/prisha_hero.jpg", "assets/prisha_hero.jpg")
create_aesthetic_dummy(800, 800, "CANDID MEMORY PHOTO", "assets/prisha_memory.jpg", "assets/prisha_memory.jpg")

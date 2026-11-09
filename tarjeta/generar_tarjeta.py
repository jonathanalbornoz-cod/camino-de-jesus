"""Genera la tarjeta de presentación (frente y reverso), 9 x 5 cm a 600 ppp.
Requiere: pip install pillow qrcode  y las fuentes Poppins en tarjeta/fonts/."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import qrcode

AQUI = Path(__file__).parent
FUENTES = AQUI / "fonts"
W, H = 2126, 1182                      # 9 x 5 cm a 600 ppp
BG = (11, 16, 32); TXT = (241, 245, 249); MUTED = (148, 163, 184)
C1 = (124, 58, 237); C2 = (6, 182, 212)  # violeta -> cian
WA = (37, 211, 102)

def f(peso, tam): return ImageFont.truetype(str(FUENTES / f"Poppins-{peso}.ttf"), tam)

def degradado(w, h, a=C1, b=C2):
    g = Image.new("RGB", (w, h))
    px = g.load()
    for x in range(w):
        for y in range(h):
            t = (x / w) * 0.75 + (y / h) * 0.25
            px[x, y] = tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
    return g

def brillo(im, cx, cy, r, color, alpha):
    capa = Image.new("RGBA", im.size, color + (0,))
    ImageDraw.Draw(capa).ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (alpha,))
    capa = capa.filter(ImageFilter.GaussianBlur(r // 2))
    im.paste(capa, (0, 0), capa)

def texto_degradado(im, xy, t, font, a=C1, b=C2):
    d = ImageDraw.Draw(im, "RGBA")
    x0, y0, x1, y1 = map(int, d.textbbox(xy, t, font=font))
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).text(xy, t, font=font, fill=255)
    g = degradado(x1 - x0 + 2, y1 - y0 + 2, a, b)
    full = Image.new("RGB", im.size); full.paste(g, (x0, y0))
    im.paste(full, (0, 0), mask)

def envolver(d, t, font, ancho):
    lineas, actual = [], ""
    for p in t.split():
        prueba = (actual + " " + p).strip()
        if d.textlength(prueba, font=font) <= ancho: actual = prueba
        else: lineas.append(actual); actual = p
    return lineas + [actual]# ---------------- FRENTE (fondo claro, colores del logo JA) ----------------
CLARO = (246, 249, 253); NAVY = (16, 42, 77); AZUL = (36, 132, 196)
GRIS = (71, 85, 105)
im = Image.new("RGB", (W, H), CLARO)
brillo(im, W + 40, -60, 560, (186, 222, 247), 200)
brillo(im, W - 200, H + 120, 460, (214, 228, 250), 200)
d = ImageDraw.Draw(im, "RGBA")
# franja de acento a la izquierda
franja = degradado(22, H, NAVY, AZUL)
im.paste(franja, (0, 0))
# rejilla de puntos sutil detrás del QR
for x in range(1460, W, 44):
    for y in range(40, H, 44):
        d.ellipse([x - 2, y - 2, x + 2, y + 2], fill=NAVY + (28,))

# QR (lleva a la página web) sobre tarjeta blanca
QR = 500
qr_img = Image.open(AQUI / "qr-ja.png").convert("RGB").resize((QR, QR), Image.LANCZOS)
qx, qy = W - QR - 150, 300
sombra = Image.new("RGBA", im.size, NAVY + (0,))
ImageDraw.Draw(sombra).rounded_rectangle([qx - 40, qy - 20, qx + QR + 40, qy + QR + 150], 44, fill=NAVY + (70,))
sh = sombra.filter(ImageFilter.GaussianBlur(30)); im.paste(sh, (0, 0), sh)
d = ImageDraw.Draw(im, "RGBA")
d.rounded_rectangle([qx - 40, qy - 40, qx + QR + 40, qy + QR + 130], 44, fill=(255, 255, 255))
im.paste(qr_img, (qx, qy))
lab = "Visita mi página web"
lw = d.textlength(lab, font=f("SemiBold", 36))
d.text((qx + QR / 2 - lw / 2, qy + QR + 30), lab, font=f("SemiBold", 36), fill=NAVY)

# textos (lado izquierdo)
X = 140
d.rounded_rectangle([X, 195, X + 80, 203], 4, fill=AZUL)
d.text((X, 225), "Jonathan Albornoz", font=f("Bold", 104), fill=NAVY)
d.text((X + 4, 365), "DESARROLLADOR WEB", font=f("SemiBold", 34), fill=AZUL)
texto_degradado(im, (X, 455), "Creación de páginas web", f("ExtraBold", 74), NAVY, AZUL)
texto_degradado(im, (X, 540), "desde cero", f("ExtraBold", 74), NAVY, AZUL)
d.text((X, 655), "Diseño y desarrollo personalizado", font=f("SemiBold", 44), fill=NAVY)
desc = ("Creo páginas web a la medida de tu negocio: landing pages que convierten, "
        "sitios corporativos y tiendas virtuales. Rápidas, adaptadas a celular y "
        "listas para aparecer en Google.")
y = 740
for linea in envolver(d, desc, f("Regular", 33), 1170):
    d.text((X, y), linea, font=f("Regular", 33), fill=GRIS); y += 50
x, y = X, y + 45
for chip in ["Landing pages", "Sitios corporativos", "Tiendas virtuales"]:
    fw = d.textlength(chip, font=f("Medium", 30))
    d.rounded_rectangle([x, y, x + fw + 56, y + 62], 31, fill=AZUL + (26,), outline=AZUL + (120,), width=3)
    d.text((x + 28, y + 12), chip, font=f("Medium", 30), fill=NAVY)
    x += fw + 80
im.save(AQUI / "tarjeta-frente.png", dpi=(600, 600))



# ---------------- REVERSO ----------------
im = degradado(W, H)
brillo(im, 200, 100, 500, (255, 255, 255), 50)
brillo(im, W, H, 600, BG, 120)
d = ImageDraw.Draw(im, "RGBA")
for r in (380, 520, 660):
    d.ellipse([W + 60 - r, H + 60 - r, W + 60 + r, H + 60 + r], outline=(255, 255, 255, 28), width=3)

X = 140
d.text((X, 235), "¿Listo para tener", font=f("SemiBold", 64), fill=(255, 255, 255))
d.text((X, 320), "tu página web?", font=f("ExtraBold", 92), fill=(255, 255, 255))
d.text((X, 455), "Escríbeme por WhatsApp", font=f("Regular", 40), fill=(255, 255, 255, 220))

# píldora de WhatsApp
py = 565
d.rounded_rectangle([X, py, X + 1020, py + 170], 85, fill=(255, 255, 255))
cx, cy = X + 85, py + 85
d.ellipse([cx - 58, cy - 58, cx + 58, cy + 58], fill=WA)
d.polygon([(cx - 50, cy + 30), (cx - 62, cy + 66), (cx - 22, cy + 52)], fill=WA)
d.rounded_rectangle([cx - 20, cy - 32, cx + 20, cy + 32], 9, outline="white", width=8)
d.text((X + 180, py + 30), "+57 321 826 4078", font=f("Bold", 80), fill=BG)

d.text((X, 845), "jonathanalbornoz-cod.github.io", font=f("Medium", 46), fill=(255, 255, 255))
d.text((X, 925), "Jonathan Albornoz · Desarrollador web", font=f("Regular", 36), fill=(255, 255, 255, 200))

# QR en tarjeta blanca
q = qrcode.QRCode(border=0, box_size=20, error_correction=qrcode.constants.ERROR_CORRECT_M)
q.add_data("https://wa.me/573218264078"); q.make(fit=True)
qi = q.make_image(fill_color=BG, back_color="white").convert("RGBA").resize((520, 520), Image.NEAREST)
qx, qy = W - 520 - 210, (H - 680) // 2
sombra = Image.new("RGBA", im.size, (0, 0, 0, 0))
ImageDraw.Draw(sombra).rounded_rectangle([qx - 50, qy - 30, qx + 570, qy + 690], 48, fill=(0, 0, 0, 110))
sh = sombra.filter(ImageFilter.GaussianBlur(35)); im.paste(sh, (0, 0), sh)
d = ImageDraw.Draw(im, "RGBA")
d.rounded_rectangle([qx - 50, qy - 50, qx + 570, qy + 670], 48, fill=(255, 255, 255))
im.paste(qi, (qx, qy))
lab = "Escanea y escríbeme"
lw = d.textlength(lab, font=f("SemiBold", 36))
d.text((qx + 260 - lw / 2, qy + 565), lab, font=f("SemiBold", 36), fill=BG)
im.convert("RGB").save(AQUI / "tarjeta-reverso.png", dpi=(600, 600))

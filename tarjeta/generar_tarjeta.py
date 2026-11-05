from PIL import Image, ImageDraw, ImageFont
import qrcode
W,H=1063,591  # 9 x 5 cm a 300 dpi
NAVY=(20,33,61); GOLD=(200,148,15); CREAM=(253,246,233); GREEN=(37,211,102)
F="/usr/share/fonts/truetype/dejavu/"
def f(n,s): return ImageFont.truetype(F+n,s)
def ctext(d,y,t,font,fill):
    w=d.textlength(t,font=font); d.text(((W-w)/2,y),t,font=font,fill=fill)
out="/home/user/camino-de-jesus/tarjeta/"

# --- FRENTE ---
im=Image.new("RGB",(W,H),NAVY); d=ImageDraw.Draw(im)
d.rectangle([30,30,W-30,H-30],outline=GOLD,width=4)
# cruz
cx=W//2; d.rectangle([cx-7,80,cx+7,180],fill=GOLD); d.rectangle([cx-35,105,cx+35,119],fill=GOLD)
ctext(d,215,"Jonathan Albornoz",f("DejaVuSerif-Bold.ttf",70),CREAM)
d.line([cx-180,315,cx+180,315],fill=GOLD,width=3)
ctext(d,340,"El Camino de Jesús",f("DejaVuSerif.ttf",44),GOLD)
ctext(d,460,"jonathanalbornoz-cod.github.io",f("DejaVuSans.ttf",32),CREAM)
im.save(out+"tarjeta-frente.png",dpi=(300,300))

# --- REVERSO ---
im=Image.new("RGB",(W,H),CREAM); d=ImageDraw.Draw(im)
d.rectangle([0,0,W,22],fill=NAVY); d.rectangle([0,H-22,W,H],fill=NAVY)
d.rectangle([0,22,W,28],fill=GOLD); d.rectangle([0,H-28,W,H-22],fill=GOLD)
qr=qrcode.QRCode(border=1,box_size=10); qr.add_data("https://wa.me/573218264078"); qr.make(fit=True)
q=qr.make_image(fill_color=NAVY,back_color=CREAM).convert("RGB").resize((330,330),Image.NEAREST)
im.paste(q,(W-330-60,(H-330)//2))
# icono burbuja de chat verde
x,y=80,150
d.ellipse([x,y,x+90,y+90],fill=GREEN); d.polygon([(x+8,y+70),(x,y+98),(x+32,y+84)],fill=GREEN)
d.rounded_rectangle([x+30,y+25,x+60,y+65],radius=8,outline="white",width=6)
d.text((x+115,y+12),"WhatsApp",font=f("DejaVuSans-Bold.ttf",54),fill=NAVY)
d.text((80,280),"+57 321 826 4078",font=f("DejaVuSans-Bold.ttf",50),fill=NAVY)
d.text((80,375),"Escanea el código para",font=f("DejaVuSans.ttf",30),fill=(90,90,90))
d.text((80,412),"escribirme directamente",font=f("DejaVuSans.ttf",30),fill=(90,90,90))
im.save(out+"tarjeta-reverso.png",dpi=(300,300))

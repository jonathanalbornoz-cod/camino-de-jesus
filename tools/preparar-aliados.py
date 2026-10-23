"""Deja cada logo de aliado en un cuadrado del mismo tamaño.

Los tres llegan distintos: dos sobre blanco y uno sobre negro, con márgenes
desiguales. Se recorta el borde del color de fondo, se vuelve a cuadrar con
ese mismo color y se deja un margen interno igual para todos, así los tres
pesan lo mismo dentro de su tarjeta y el borde dorado no les queda pegado.
"""
import sys
from PIL import Image, ImageChops

LADO = 600       # el cuadrado final, suficiente para 300 px en pantalla retina
MARGEN = 0.07    # aire alrededor del logo, en fracción del lado

def fondo(im):
    # El color de las cuatro esquinas; si no coinciden, manda la primera.
    esquinas = [im.getpixel(p) for p in
                [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]]
    return max(set(esquinas), key=esquinas.count)

def recortar(im, color, tolerancia=12):
    # bbox() sobre la diferencia contra un lienzo del color de fondo. El
    # point() convierte en negro todo lo que esté dentro de la tolerancia,
    # para que una compresión JPEG ruidosa no cuente como contenido.
    dif = ImageChops.difference(im, Image.new('RGB', im.size, color))
    dif = dif.convert('L').point(lambda v: 255 if v > tolerancia else 0)
    return im.crop(dif.getbbox() or (0, 0, im.width, im.height))

for origen, destino in zip(sys.argv[1::2], sys.argv[2::2]):
    im = Image.open(origen).convert('RGB')
    color = fondo(im)
    im = recortar(im, color)

    util = round(LADO * (1 - 2 * MARGEN))
    im.thumbnail((util, util), Image.LANCZOS)

    lienzo = Image.new('RGB', (LADO, LADO), color)
    lienzo.paste(im, ((LADO - im.width) // 2, (LADO - im.height) // 2))
    lienzo.save(destino, 'WEBP', quality=90, method=6)
    print(f'{destino}  {im.size[0]}x{im.size[1]} sobre {color}')

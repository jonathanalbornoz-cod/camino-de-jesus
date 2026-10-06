# -*- coding: utf-8 -*-
"""
Prepara las fotos de producto de Quesera Chiminangos para la web.

    python3 tools/preparar-fotos.py <carpeta-con-los-originales> [destino]

Hace tres cosas: recorta a 3:4, deja el ancho nativo del set y guarda en WebP.

Las fotos NO se editan: la onda dorada del fondo se conserva, que es como
están tomadas y como el cliente las quiere.

Sobre la calidad: antes se recomprimían a 900 px con calidad 82 y quedaban
empastadas —40 KB para una imagen de un megapíxel, con la textura del queso
deshecha—. Ahora van al ancho nativo (1024 px tras el recorte) con calidad 90,
sobre 150 KB cada una. En una pantalla retina la tarjeta pide unos 750 px y la
portada unos 1080, así que 1024 cubre bien y el producto conserva su textura.

El recorte va desplazado hacia arriba (0.62) porque en este set el producto
vive en la mitad baja del encuadre.
"""
from PIL import Image
import glob, os, sys, unicodedata, re

ANCHO_MAX, CALIDAD = 1400, 90


def slug(t):
    t = (t.replace("#U00f1", "n").replace("#U00f3", "o").replace("#U00ed", "i")
          .replace("#U00e1", "a").replace("#U00fa", "u").replace("#U00e9", "e"))
    t = unicodedata.normalize("NFD", t).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-zA-Z0-9]+", "-", t).strip("-").lower()


# «Copa salsera.png» (sin espacio antes del punto) es en realidad el vinagre:
# su propia etiqueta dice «Vinagre blanco Distrivalle 3000 ml».
RENOMBRAR = {"Copa salsera": "vinagre"}


def preparar(origen, destino):
    os.makedirs(destino, exist_ok=True)
    hechas = 0
    for f in sorted(glob.glob(os.path.join(origen, "*.png")) +
                    glob.glob(os.path.join(origen, "*.jpg"))):
        base = os.path.splitext(os.path.basename(f))[0]
        nombre = RENOMBRAR.get(base, slug(base))
        im = Image.open(f).convert("RGB")
        w, h = im.size
        alto = int(w / 0.75)
        if alto < h:
            arriba = int((h - alto) * 0.62)
            im = im.crop((0, arriba, w, arriba + alto))
        if im.width > ANCHO_MAX:
            im = im.resize((ANCHO_MAX, round(ANCHO_MAX * im.height / im.width)),
                           Image.LANCZOS)
        im.save(os.path.join(destino, nombre + ".webp"), "WEBP",
                quality=CALIDAD, method=6)
        hechas += 1
    return hechas


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__.strip().splitlines()[2].strip())
        raise SystemExit(1)
    origen = sys.argv[1]
    destino = sys.argv[2] if len(sys.argv) > 2 else "quesera/imagenes/productos"
    n = preparar(origen, destino)
    fs = glob.glob(os.path.join(destino, "*.webp"))
    t = sum(os.path.getsize(x) for x in fs)
    print(f"{n} preparadas · {len(fs)} en la carpeta · {t//1024} KB · "
          f"media {t//max(1,len(fs))//1024} KB")

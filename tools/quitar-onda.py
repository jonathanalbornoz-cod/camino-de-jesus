"""
Quita la onda dorada del fondo de las fotos de producto de Quesera Chiminangos.

El set es un fondo de dos tonos —vino arriba, crema abajo— con una onda dorada
en la unión. Aquí esa unión pasa a ser un horizonte recto; el producto y su
sombra quedan intactos.

Todo se ancla en un solo dato fiable: bajando por una columna desde el borde
superior, el vino oscuro no se confunde con ningún producto, así que la racha
se corta exactamente donde empieza otra cosa. Si lo que hay justo ahí es
dorado, esa columna nos está mostrando la onda y se puede repintar. Si es el
producto, la columna se deja como está — y da igual, porque ahí la unión
queda tapada por el producto.

Lo que NO funcionó, por si alguien lo intenta de nuevo:
  · Separar por color: el queso blanco (233,224,212) y el piso crema
    (238,222,206) son el mismo color, y el cheddar es del mismo naranja que
    la onda.
  · Relleno por vecindad desde los bordes: el degradado del queso es tan
    suave que el relleno se mete dentro y lo aplasta.
  · Barrer las filas de lado a lado: entra al queso por el mismo motivo.
"""
from PIL import Image
import numpy as np
import sys, os

TOL_VINO = 34          # el vino apenas varía (±3); holgado va sobrado
SUAVE = 16             # salto máximo entre píxeles contiguos del fondo
BORDE = 5              # píxeles de antialias a saltar al salir de la onda


def _oro(p):
    return p[0] > 180 and 100 < p[1] < 225 and p[2] < 45


def quitar_onda(entrada, salida, ventana=None, flecos=True,
                banda_completa=False, margen_abajo=0, forzar=()):
    im = Image.open(entrada).convert("RGB")
    a = np.array(im).astype(np.int16)
    h, w, _ = a.shape

    vino = np.median(a[:int(h * .05)].reshape(-1, 3), axis=0)
    crema = np.median(a[int(h * .97):].reshape(-1, 3), axis=0)
    # El vino no se mide por distancia a una referencia: el fondo lleva un
    # degradado y abajo es bastante más oscuro que arriba (en la foto de la
    # costilla, un 40% de las filas bajas se salía de tolerancia). Se mide por
    # tono, que es lo que de verdad lo distingue: oscuro, rojizo y sin azul.
    # Un empaque negro (20,20,20) no pasa, y uno rojo (200,30,40) tampoco.
    R, G, B = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    es_vino = ((np.abs(a - vino.reshape(1, 1, 3)).max(axis=2) <= TOL_VINO) |
               ((R > 28) & (R < 120) & (G < 62) & (B < 72) & (R > G + 14)))
    es_oro = (a[:, :, 0] > 180) & (a[:, :, 1] > 100) & (a[:, :, 1] < 225) & (a[:, :, 2] < 45)

    # El barrido arranca por debajo de cualquier estorbo pegado al borde
    # superior — en la foto de la costilla, la barra de la que cuelga.
    limpias = np.nonzero(es_vino[:int(h * .35)].mean(axis=1) >= .80)[0]
    inicio = int(limpias.max()) if len(limpias) else 0

    # Dónde se corta el vino en cada columna
    fin_vino = inicio + es_vino[inicio:].astype(np.uint8).cumprod(axis=0).sum(axis=0)

    # Columnas que enseñan la onda: justo donde acaba el vino, empieza el oro
    columnas = {}
    for x in range(w):
        t = int(fin_vino[x])
        # Se mira 30 px por delante, no 4: en algunas tomas el borde de la onda
        # es una rampa larga (la costilla pasa de vino a oro en ~40 px) y con
        # una ventana corta la onda no se encuentra.
        if t >= h - 2 or not es_oro[t:t + 48, x].any():
            continue
        # La racha se mide desde el primer píxel dorado de verdad, no desde
        # donde acaba el vino: entre los dos puede haber rampa.
        cerca = np.nonzero(es_oro[t:t + 48, x])[0]
        g0 = t + int(cerca[0])
        g = g0
        while g + 1 < h and (es_oro[g + 1, x] or es_oro[g + 1:g + 4, x].any()):
            g += 1
        if g - g0 >= 12:
            columnas[x] = (t, g)

    if ventana:                                       # acotado a mano si hace falta
        columnas = {x: (t, g) for x, (t, g) in columnas.items()
                    if ventana[0] <= t <= ventana[1]}

    if len(columnas) < w * .05:
        return None                                   # esta foto no trae onda

    # La onda es un trazo continuo: las columnas cuyo tope se sale del grupo
    # no son la onda sino un producto del mismo color (el cheddar, por caso).
    ts = np.array([v[0] for v in columnas.values()])
    med = np.median(ts)
    mad = np.median(np.abs(ts - med)) or 1
    limite = max(30, 5 * mad)
    columnas = {x: v for x, v in columnas.items() if abs(v[0] - med) <= limite}
    if len(columnas) < w * .05:
        return None

    topes = np.array([v[0] for v in columnas.values()])
    bases = np.array([v[1] for v in columnas.values()])
    W0, W1 = int(topes.min()) - 4, int(bases.max()) + 4 + margen_abajo
    W0, W1 = max(0, W0), min(h - 1, W1)
    horizonte = int(np.median((topes + bases) / 2))

    # Tono de cada columna, tomado del fondo justo fuera de la banda
    franja_v = a[max(0, W0 - 34):max(1, W0 - 4)]
    franja_c = a[min(h - 1, W1 + 4):min(h, W1 + 34)]
    tono_vino = np.median(franja_v, axis=0)
    tono_crema = np.median(franja_c, axis=0)

    # Si en esa columna las filas de muestra caen sobre el producto o sobre la
    # tabla, el tono sale mal y deja un rectángulo blanco. Cuando se aleja
    # demasiado del fondo, se usa el tono general de la foto.
    malo_v = np.abs(tono_vino - vino).max(axis=1) > 45
    malo_c = np.abs(tono_crema - crema).max(axis=1) > 45
    tono_vino[malo_v] = vino
    tono_crema[malo_c] = crema

    # Para frenar la extensión no basta con que el degradado sea suave: el
    # queso pálido entra sin salto y el relleno se lo come. Se exige además
    # que el píxel siga siendo del color del fondo por ese lado.
    es_crema = np.abs(a - crema.reshape(1, 1, 3)).max(axis=2) <= 34

    arr = a.copy()
    pintadas = 0

    # Rangos de columnas que se sabe que son fondo limpio de arriba abajo.
    # Se usan donde el borde difuminado de la onda se confunde con el propio
    # producto y ninguna regla automática lo separa bien.
    for x0, x1 in forzar:
        for x in range(max(0, x0), min(w, x1 + 1)):
            columnas.setdefault(x, (W0, W1))

    for x, (t, g) in columnas.items():
        # Hacia arriba desde la onda, mientras siga siendo vino y sin saltos
        y = t - BORDE
        while y > W0 and es_vino[y, x] and np.abs(a[y, x] - a[y + 1, x]).max() <= SUAVE:
            y -= 1
        arriba = max(W0, y)
        # Y hacia abajo, mientras siga siendo crema y sin saltos
        y = g + BORDE
        while y < W1 and es_crema[y, x] and np.abs(a[y, x] - a[y - 1, x]).max() <= SUAVE:
            y += 1
        abajo = min(W1, y)

        # banda_completa: cuando una columna enseña la onda es porque no tiene
        # producto encima — y en fotos como la de la costilla, donde el
        # producto cuelga desde arriba, tampoco lo tiene debajo. Entonces se
        # puede repintar la banda entera y llevarse también el borde difuso.
        if banda_completa:
            arriba, abajo = W0, W1

        filas = np.arange(arriba, abajo + 1)
        arr[filas[filas < horizonte], x] = tono_vino[x]
        arr[filas[filas >= horizonte], x] = tono_crema[x]
        pintadas += 1

    # Flecos: en las columnas que el barrido no pudo leer —las que tienen
    # producto por encima— la onda sigue asomando al lado del envase. Como la
    # onda es un trazo continuo, se interpola desde las columnas que sí se
    # leyeron y ahí se repinta lo que quede del color de la onda.
    #
    # flecos=False es para la foto del cheddar: ese queso es del mismo naranja
    # que la onda, azul incluido, así que cualquier limpieza automática se lo
    # come. Ahí se prefiere dejar un resto a romper el producto.
    xs = np.array(sorted(columnas))
    tt = np.array([columnas[x][0] for x in xs])
    gg = np.array([columnas[x][1] for x in xs])
    todas = np.arange(w)
    t_interp = np.interp(todas, xs, tt)
    g_interp = np.interp(todas, xs, gg)
    filas = np.arange(h).reshape(-1, 1)
    dentro = (filas >= (t_interp - 24)) & (filas <= (g_interp + 24))

    if flecos:
        pendientes = np.zeros((h, w), bool)
        pendientes[:, [x for x in todas if x not in columnas]] = True

        # Se repasa en dos vueltas: primero el dorado limpio, luego los bordes
        # difuminados, que sólo se tocan si están pegados a lo ya repintado.
        pintado = np.zeros((h, w), bool)
        for x in columnas:
            pintado[W0:W1 + 1, x] = True

        b = np.clip(arr, 0, 255).astype(np.int16)
        oro_limpio = ((b[:, :, 0] > 180) & (b[:, :, 1] > 100) &
                      (b[:, :, 1] < 225) & (b[:, :, 2] < 45))
        objetivo = oro_limpio & dentro & pendientes
        yy, xx = np.nonzero(objetivo)
        if len(yy):
            arr[yy, xx] = np.where((yy < horizonte)[:, None], tono_vino[xx], tono_crema[xx])
            pintado[yy, xx] = True

        # El borde difuminado de la onda: mezcla de oro con crema, así que el
        # azul sube. Se acepta hasta 95 —la madera de las tablas anda por 70,
        # pero no es contigua a la onda, y aquí sólo se crece desde ella.
        for _ in range(70):
            b = np.clip(arr, 0, 255).astype(np.int16)
            difuso = ((b[:, :, 0] > 175) & (b[:, :, 1] > 95) &
                      (b[:, :, 1] < 235) & (b[:, :, 2] < 95))
            vecino = np.zeros((h, w), bool)
            vecino[:, 1:] |= pintado[:, :-1]
            vecino[:, :-1] |= pintado[:, 1:]
            vecino[1:] |= pintado[:-1]
            vecino[:-1] |= pintado[1:]
            objetivo = difuso & dentro & vecino & ~pintado
            if not objetivo.any():
                break
            yy, xx = np.nonzero(objetivo)
            arr[yy, xx] = np.where((yy < horizonte)[:, None], tono_vino[xx], tono_crema[xx])
            pintado[yy, xx] = True

    res = np.clip(arr, 0, 255).astype(np.uint8)
    Image.fromarray(res).save(salida)

    b = res.astype(np.int16)
    queda = ((b[:, :, 0] > 180) & (b[:, :, 1] > 100) & (b[:, :, 1] < 225) & (b[:, :, 2] < 45))
    cerca_onda = queda & dentro
    return {"banda": (W0, W1), "horizonte": horizonte, "columnas": len(columnas),
            "oro_sobre_la_onda": int(cerca_onda.sum())}


# Ajustes por foto, para los casos donde el producto y la onda comparten
# color y ninguna regla automática los separa bien.
AJUSTES = {
    # El cheddar es del mismo naranja que la onda, azul incluido: se acota
    # dónde puede estar la onda y se desactiva la limpieza de flecos, porque
    # se comería el queso.
    "Queso cheddar .png":    dict(ventana=(740, 880), flecos=False),
    # La costilla cuelga desde arriba: si una columna enseña la onda, esa
    # columna no tiene producto ni arriba ni abajo, así que se puede repintar
    # la banda entera y llevarse también el borde difuso de la onda.
    "Costilla ahumada .png": dict(banda_completa=True, margen_abajo=70),
}


if __name__ == "__main__":
    import glob
    if len(sys.argv) != 3:
        print("uso: quitar-onda.py <carpeta-origen> <carpeta-destino>")
        raise SystemExit(1)

    origen, destino = sys.argv[1], sys.argv[2]
    os.makedirs(destino, exist_ok=True)
    for f in sorted(glob.glob(os.path.join(origen, "*.png"))):
        n = os.path.basename(f)
        r = quitar_onda(f, os.path.join(destino, n), **AJUSTES.get(n, {}))
        print(f"{n[:34]:36} {'sin onda que quitar' if r is None else r}")

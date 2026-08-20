# -*- coding: utf-8 -*-
"""Genera datos/catalogo.js — catálogo de DEMOSTRACIÓN, coherente consigo mismo."""
import json, random, datetime, io, unicodedata

random.seed(20260820)
HOY = datetime.date(2026, 8, 20)
DIAS = 90

TIENDAS = [
    {"id":"amazon","nombre":"Amazon","sitio":"amazon.com","pais":"EE. UU.","envioGratisDesde":35,
     "buscar":"https://www.amazon.com/s?k={q}",
     "api":{"estado":"afiliados","nombre":"Amazon Creators API","url":"https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction",
            "nota":"Reemplaza a la PA-API 5.0 (obsoleta el 15 de mayo de 2026). Exige cuenta activa de Amazon Associates."}},
    {"id":"ebay","nombre":"eBay","sitio":"ebay.com","pais":"EE. UU.","envioGratisDesde":0,
     "buscar":"https://www.ebay.com/sch/i.html?_nkw={q}",
     "api":{"estado":"oficial","nombre":"eBay Browse API","url":"https://developer.ebay.com/api-docs/buy/browse/overview.html",
            "nota":"Gratuita. Token de aplicación con client credentials."}},
    {"id":"bestbuy","nombre":"Best Buy","sitio":"bestbuy.com","pais":"EE. UU.","envioGratisDesde":35,
     "buscar":"https://www.bestbuy.com/site/searchpage.jsp?st={q}",
     "api":{"estado":"oficial","nombre":"Best Buy Developer API","url":"https://developer.bestbuy.com/",
            "nota":"Clave gratuita; catálogo, precios y disponibilidad por tienda."}},
    {"id":"walmart","nombre":"Walmart","sitio":"walmart.com","pais":"EE. UU.","envioGratisDesde":35,
     "buscar":"https://www.walmart.com/search?q={q}",
     "api":{"estado":"afiliados","nombre":"Walmart I/O","url":"https://walmart.io/",
            "nota":"Requiere aprobación como partner o afiliado (Impact)."}},
    {"id":"newegg","nombre":"Newegg","sitio":"newegg.com","pais":"EE. UU.","envioGratisDesde":0,
     "buscar":"https://www.newegg.com/p/pl?d={q}",
     "api":{"estado":"ninguna","nombre":"Sin API pública de catálogo","url":"https://www.newegg.com/",
            "nota":"Su API es para vendedores del marketplace. Datos vía redes de afiliados."}},
    {"id":"bhphoto","nombre":"B&H Photo","sitio":"bhphotovideo.com","pais":"EE. UU.","envioGratisDesde":49,
     "buscar":"https://www.bhphotovideo.com/c/search?q={q}",
     "api":{"estado":"ninguna","nombre":"Sin API pública","url":"https://www.bhphotovideo.com/",
            "nota":"Programa de afiliados con feed de productos."}},
    {"id":"target","nombre":"Target","sitio":"target.com","pais":"EE. UU.","envioGratisDesde":35,
     "buscar":"https://www.target.com/s?searchTerm={q}",
     "api":{"estado":"ninguna","nombre":"Sin API pública","url":"https://www.target.com/",
            "nota":"Afiliados vía Impact; sin API abierta de precios."}},
    {"id":"costco","nombre":"Costco","sitio":"costco.com","pais":"EE. UU.","envioGratisDesde":0,
     "buscar":"https://www.costco.com/CatalogSearch?keyword={q}",
     "api":{"estado":"ninguna","nombre":"Sin API pública","url":"https://www.costco.com/",
            "nota":"Precios visibles solo para socios en varias categorías."}},
    {"id":"aliexpress","nombre":"AliExpress","sitio":"aliexpress.com","pais":"China","envioGratisDesde":0,
     "buscar":"https://www.aliexpress.com/wholesale?SearchText={q}",
     "api":{"estado":"afiliados","nombre":"AliExpress Open Platform","url":"https://openservice.aliexpress.com/",
            "nota":"API de afiliados; alta como developer."}},
    {"id":"mercadolibre","nombre":"MercadoLibre","sitio":"mercadolibre.cl","pais":"Chile","envioGratisDesde":0,
     "buscar":"https://listado.mercadolibre.cl/{q}",
     "api":{"estado":"oficial","nombre":"API de MercadoLibre","url":"https://developers.mercadolibre.com/",
            "nota":"Búsqueda pública de ítems; OAuth para el resto."}},
]

CATEGORIAS = [
    {"id":"audio","nombre":"Audio"},
    {"id":"computacion","nombre":"Computación"},
    {"id":"moviles","nombre":"Móviles y tablets"},
    {"id":"gaming","nombre":"Gaming"},
    {"id":"foto","nombre":"Foto y video"},
]

# nombre, marca, categoria, modelo, precioLista, icono, especificaciones, temas
PRODUCTOS = [
    ("Audífonos Sony WH-1000XM5","Sony","audio","WH-1000XM5",399.99,"audifonos",
     [("Tipo","Over-ear inalámbricos"),("Cancelación de ruido","Activa, adaptativa"),("Batería","30 h"),("Peso","250 g")],
     [("Cancelación de ruido",412),("Comodidad",286),("Calidad de llamada",118),("Precio alto",74)],
     [("Se apagan solos a veces",41)]),
    ("Apple AirPods Pro (2.ª gen)","Apple","audio","MTJV3AM/A",249.00,"audifonos",
     [("Tipo","In-ear inalámbricos"),("Cancelación de ruido","Activa"),("Batería","6 h + 24 h estuche"),("Carga","USB-C")],
     [("Integración con iPhone",520),("Cancelación de ruido",347),("Audio espacial",162)],
     [("Duración de las gomas",88),("Precio alto",96)]),
    ("Parlante JBL Charge 5","JBL","audio","JBLCHARGE5",179.95,"parlante",
     [("Potencia","40 W"),("Resistencia","IP67"),("Batería","20 h"),("Extras","Power bank")],
     [("Sonido potente",298),("Resistente al agua",211),("Batería",174)],
     [("Pesado para llevar",63)]),
    ("Mouse Logitech MX Master 3S","Logitech","computacion","910-006557",99.99,"mouse",
     [("Sensor","8000 DPI"),("Conexión","Bluetooth / USB-C"),("Batería","70 días"),("Botones","7")],
     [("Ergonomía",389),("Scroll MagSpeed",254),("Multiequipo",147)],
     [("Software pesado",57)]),
    ("Monitor LG UltraGear 27\" 165 Hz","LG","computacion","27GP850-B",449.99,"monitor",
     [("Panel","Nano IPS 27\""),("Resolución","2560 × 1440"),("Refresco","165 Hz (OC 180)"),("Respuesta","1 ms")],
     [("Colores y brillo",241),("Fluidez a 165 Hz",198),("Ajuste de altura",92)],
     [("Retroiluminación irregular",66),("Parlantes ausentes",44)]),
    ("SSD Samsung 990 PRO 2 TB","Samsung","computacion","MZ-V9P2T0BW",249.99,"ssd",
     [("Interfaz","PCIe 4.0 NVMe"),("Capacidad","2 TB"),("Lectura","7450 MB/s"),("Garantía","5 años")],
     [("Velocidad real",356),("Temperatura",129),("Instalación fácil",108)],
     [("Precio por TB",71)]),
    ("Samsung Galaxy S24 128 GB","Samsung","moviles","SM-S921B",799.99,"telefono",
     [("Pantalla","6,2\" AMOLED 120 Hz"),("Procesador","Exynos 2400 / SD 8 Gen 3"),("Cámara","50 MP"),("Batería","4000 mAh")],
     [("Tamaño compacto",274),("Cámara",233),("Actualizaciones largas",151)],
     [("Batería justa",128),("Carga lenta",83)]),
    ("iPad 10.ª generación 64 GB","Apple","moviles","MPQ03LL/A",349.00,"tablet",
     [("Pantalla","10,9\" Liquid Retina"),("Chip","A14 Bionic"),("Puerto","USB-C"),("Almacenamiento","64 GB")],
     [("Pantalla",312),("Rendimiento",219),("Batería",176)],
     [("64 GB se quedan cortos",147),("Accesorios caros",92)]),
    ("Nintendo Switch OLED","Nintendo","gaming","HEG-001",349.99,"consola",
     [("Pantalla","OLED 7\""),("Almacenamiento","64 GB"),("Modos","Portátil / TV / mesa"),("Dock","LAN incluida")],
     [("Pantalla OLED",401),("Portabilidad",288),("Catálogo",165)],
     [("Drift en los Joy-Con",203),("Sin 4K",57)]),
    ("Cámara GoPro HERO12 Black","GoPro","foto","CHDHX-121",399.99,"camara",
     [("Video","5,3K 60 fps"),("Estabilización","HyperSmooth 6.0"),("Resistencia","Sumergible 10 m"),("Batería","Enduro 1720 mAh")],
     [("Estabilización",267),("Calidad de video",224),("Tamaño",118)],
     [("Batería en 5,3K",156),("Se calienta",97)]),
]

# qué tiendas venden qué (id de producto -> lista de tiendas)
VENDEN = {
    0:["amazon","bestbuy","bhphoto","walmart","ebay","mercadolibre","target"],
    1:["amazon","bestbuy","walmart","target","costco","ebay","mercadolibre"],
    2:["amazon","bestbuy","walmart","target","ebay","aliexpress"],
    3:["amazon","bestbuy","newegg","bhphoto","ebay","mercadolibre"],
    4:["amazon","newegg","bestbuy","bhphoto","walmart","ebay"],
    5:["amazon","newegg","bestbuy","bhphoto","walmart"],
    6:["amazon","bestbuy","walmart","ebay","mercadolibre","target","aliexpress"],
    7:["amazon","bestbuy","walmart","target","costco","ebay","mercadolibre"],
    8:["amazon","bestbuy","walmart","target","gamestop","ebay","mercadolibre"],
    9:["amazon","bestbuy","bhphoto","newegg","walmart","ebay"],
}
VENDEN[8] = [t for t in VENDEN[8] if t != "gamestop"]

ENTREGAS = ["Mañana","1-2 días","2-3 días","3-5 días","5-8 días","10-20 días"]

def snap(valor):
    """Precios con cara de tienda: .99 o .95."""
    entero = int(valor)
    resto = valor - entero
    if resto < 0.30:
        return round(entero - 1 + 0.99, 2) if entero > 1 else round(entero + 0.99, 2)
    if resto > 0.80:
        return round(entero + 0.99, 2)
    return round(entero + 0.95, 2)

def historial(precio_final, lista, promos):
    """Camino de 90 días que termina exactamente en precio_final."""
    serie = []
    partida = precio_final * random.uniform(1.04, 1.16)
    for dia in range(DIAS):
        # el nivel baja poco a poco hasta el precio de hoy, para que el
        # último día no aparezca como un salto brusco
        avance = (dia / (DIAS - 1)) ** 1.6
        objetivo = partida + (precio_final - partida) * avance
        valor = min(objetivo * random.uniform(0.994, 1.006), lista * 1.02)
        for inicio, largo, hondura in promos:
            if inicio <= dia < inicio + largo:
                valor *= hondura
        serie.append(valor)
    serie[-1] = precio_final
    return [snap(v) for v in serie[:-1]] + [round(precio_final, 2)]

def distribucion(total, objetivo):
    """Reparto de estrellas 5→1 cuyo promedio da el objetivo (±0,005)."""
    forma = {5:0.62, 4:0.22, 3:0.08, 2:0.04, 1:0.04}
    cuentas = {e: max(1, int(total * p)) for e, p in forma.items()}
    cuentas[5] += total - sum(cuentas.values())
    def promedio(c):
        return sum(e * n for e, n in c.items()) / sum(c.values())
    for _ in range(20000):
        actual = promedio(cuentas)
        if abs(actual - objetivo) < 0.005:
            break
        if actual < objetivo and cuentas[1] + cuentas[2] > 2:
            origen = 1 if cuentas[1] > 1 else 2
            cuentas[origen] -= 1; cuentas[5] += 1
        elif actual > objetivo and cuentas[5] > 1:
            cuentas[5] -= 1; cuentas[2 if cuentas[1] > total*0.06 else 1] += 1
        else:
            break
    return [cuentas[5], cuentas[4], cuentas[3], cuentas[2], cuentas[1]]

def ranura(texto):
    base = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    return "".join(c if c.isalnum() else "-" for c in base.lower()).strip("-").replace("--", "-")

productos = []
for indice, (nombre, marca, categoria, modelo, lista, icono, especificaciones, pros, contras) in enumerate(PRODUCTOS):
    tiendas_producto = VENDEN[indice]
    # descuento del mejor precio: entre 8 % y 32 %
    mejor = lista * (1 - random.uniform(0.08, 0.32))
    ofertas = []
    for posicion, tienda_id in enumerate(tiendas_producto):
        factor = 1.0 + posicion * random.uniform(0.012, 0.055)
        precio = snap(min(mejor * factor, lista * 1.05))
        tienda = next(t for t in TIENDAS if t["id"] == tienda_id)
        envio = 0.0 if precio >= tienda["envioGratisDesde"] else round(random.choice([4.99, 5.99, 7.99]), 2)
        if tienda_id == "aliexpress":
            envio = 0.0
        ofertas.append({
            "tienda": tienda_id,
            "precio": precio,
            "precioLista": lista,
            "envio": envio,
            "total": round(precio + envio, 2),
            "stock": random.choice(["disponible"] * 6 + ["pocas", "agotado"]),
            "entrega": random.choice(ENTREGAS[:4] if tienda_id != "aliexpress" else ENTREGAS[4:]),
            "vendedor": "Tienda oficial" if tienda_id != "ebay" else "Vendedor con 99,2 % positivo",
            "nota": round(random.uniform(3.9, 4.8), 1),
            "resenas": random.randint(120, 4200),
        })
    ofertas.sort(key=lambda o: o["total"])

    promos = [(random.randint(8, 30), random.randint(3, 7), random.uniform(0.86, 0.94)),
              (random.randint(45, 72), random.randint(4, 9), random.uniform(0.88, 0.96))]
    series = {}
    for oferta in ofertas[:4]:
        series[oferta["tienda"]] = historial(oferta["precio"], lista, promos)

    total_resenas = sum(o["resenas"] for o in ofertas)
    global_nota = round(sum(o["nota"] * o["resenas"] for o in ofertas) / total_resenas, 2)

    productos.append({
        "id": ranura(nombre),
        "nombre": nombre,
        "marca": marca,
        "categoria": categoria,
        "modelo": modelo,
        "icono": icono,
        "precioLista": lista,
        "especificaciones": [{"clave": c, "valor": v} for c, v in especificaciones],
        "ofertas": ofertas,
        "historial": {"desde": (HOY - datetime.timedelta(days=DIAS - 1)).isoformat(), "dias": DIAS, "series": series},
        "resenas": {
            "nota": global_nota,
            "total": total_resenas,
            "distribucion": distribucion(total_resenas, global_nota),
            "porTienda": [{"tienda": o["tienda"], "nota": o["nota"], "total": o["resenas"]} for o in ofertas],
            "pros": [{"tema": t, "menciones": n} for t, n in pros],
            "contras": [{"tema": t, "menciones": n} for t, n in contras],
        },
    })

catalogo = {
    "generado": HOY.isoformat(),
    "moneda": "USD",
    "demostracion": True,
    "tiendas": TIENDAS,
    "categorias": CATEGORIAS,
    "productos": productos,
}

cuerpo = json.dumps(catalogo, ensure_ascii=False, indent=1)
salida = io.open("/home/user/camino-de-jesus/Comparando precios/datos/catalogo.js", "w", encoding="utf-8")
salida.write("""/* ---------------------------------------------------------------
   Comparando precios — catálogo de DEMOSTRACIÓN.

   ⚠ Los precios, existencias y notas de este archivo son inventados
   para poder mostrar la página funcionando. NO son precios reales de
   las tiendas nombradas y no sirven para decidir una compra.

   Para datos reales hay que reemplazar este archivo por la respuesta
   de las APIs descritas en README.md (ver comun/fuentes.js).
   Generado por herramientas/generar-catalogo.py
--------------------------------------------------------------- */
window.CATALOGO = """)
salida.write(cuerpo)
salida.write(";\n")
salida.close()

# --- comprobaciones de coherencia ---
for p in productos:
    for oferta in p["ofertas"]:
        serie = p["historial"]["series"].get(oferta["tienda"])
        if serie:
            assert abs(serie[-1] - oferta["precio"]) < 0.005, (p["id"], oferta["tienda"])
    r = p["resenas"]
    assert sum(r["distribucion"]) == r["total"], p["id"]
    media = sum((5 - i) * n for i, n in enumerate(r["distribucion"])) / r["total"]
    assert abs(media - r["nota"]) < 0.02, (p["id"], media, r["nota"])
    ponderada = sum(t["nota"] * t["total"] for t in r["porTienda"]) / sum(t["total"] for t in r["porTienda"])
    assert abs(ponderada - r["nota"]) < 0.01, p["id"]
print("catálogo OK:", len(productos), "productos,", len(TIENDAS), "tiendas")
print("descuentos:", [round(100*(p["precioLista"]-p["ofertas"][0]["precio"])/p["precioLista"]) for p in productos])

#!/usr/bin/env python3
"""
Hornea las respuestas de la API dentro del repositorio.

Toma los JSON tal cual los devuelve api.agroforestaldecolombia.com y los deja en
agroforestal/data/, con las URL de imagen reescritas a las copias locales de
agroforestal/storage/. A partir de ahí el sitio publicado no necesita el backend.

Uso:
    python3 tools/hornear.py products.json [products-pagina2.json ...] posts.json

Acepta varios archivos del mismo recurso (la API pagina de 200 en 200) y los
fusiona por id, quedándose con la última versión de cada uno. El recurso se
deduce del contenido, no del nombre del archivo.

Las categorías y las marcas no se piden aparte: se derivan de los objetos que
cada producto trae anidados, que es la misma fila de la base de datos.
"""

import json
import os
import re
import sys
from collections import OrderedDict

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITIO = os.path.join(RAIZ, 'agroforestal')
DATOS = os.path.join(SITIO, 'data')
STORAGE = os.path.join(SITIO, 'storage')

# Las imágenes se exportaron con un sufijo que la API no conoce:
# .../storage/products/<uuid>.png  ->  storage/products/<uuid>_min.png
URL_STORAGE = re.compile(r'https?://[^/]*agroforestaldecolombia\.com/storage/([^"\'\s]+)')


def indice_local():
    """Mapa 'products/<uuid>' -> ruta real en disco, ignorando el sufijo _min."""
    idx = {}
    for carpeta in ('products', 'branding', 'hero', 'feed'):
        d = os.path.join(STORAGE, carpeta)
        if not os.path.isdir(d):
            continue
        for archivo in os.listdir(d):
            nombre, _, ext = archivo.rpartition('.')
            if not nombre:
                continue
            clave = nombre[:-4] if nombre.endswith('_min') else nombre
            idx[f'{carpeta}/{clave}'] = f'storage/{carpeta}/{archivo}'
    return idx


def reescribir(valor, idx, faltantes):
    """Sustituye recursivamente toda URL del backend por su copia local."""
    if isinstance(valor, str):
        m = URL_STORAGE.fullmatch(valor.strip())
        if not m:
            return valor
        resto = m.group(1)
        carpeta, _, archivo = resto.partition('/')
        clave = f'{carpeta}/{archivo.rpartition(".")[0]}'
        if clave in idx:
            return idx[clave]
        faltantes.add(valor)
        return valor
    if isinstance(valor, list):
        return [reescribir(v, idx, faltantes) for v in valor]
    if isinstance(valor, dict):
        return {k: reescribir(v, idx, faltantes) for k, v in valor.items()}
    return valor


def cargar(ruta):
    with open(ruta, encoding='utf-8') as fh:
        datos = json.load(fh)
    if isinstance(datos, dict) and isinstance(datos.get('data'), list):
        return datos['data'], datos.get('total'), datos.get('last_page', 1)
    if isinstance(datos, list):
        return datos, len(datos), 1
    raise SystemExit(f'{ruta}: no reconozco el formato (ni lista ni paginador)')


def clasificar(items):
    """products o posts, por los campos que trae el primer elemento."""
    if not items:
        return None
    campos = set(items[0])
    if {'title', 'body'} & campos:
        return 'posts'
    if {'sku', 'cover_image', 'category_id'} & campos:
        return 'products'
    return None


def derivar(items, campo):
    """Extrae categorías o marcas de los objetos anidados de cada producto."""
    fuera = OrderedDict()
    for it in items:
        obj = it.get(campo)
        if isinstance(obj, dict) and obj.get('id') is not None:
            fuera[obj['id']] = obj
    return sorted(fuera.values(), key=lambda o: str(o.get('name', '')))


def main(argv):
    if not argv:
        raise SystemExit(__doc__)

    idx = indice_local()
    faltantes = set()
    recursos = {'products': OrderedDict(), 'posts': OrderedDict()}
    esperado = {}

    for ruta in argv:
        items, total, ultima = cargar(ruta)
        tipo = clasificar(items)
        if not tipo:
            print(f'  ! {os.path.basename(ruta)}: no sé qué recurso es, lo salto')
            continue
        for it in items:
            recursos[tipo][it.get('id', len(recursos[tipo]))] = it
        if total is not None:
            esperado[tipo] = total
        print(f'  · {os.path.basename(ruta)}: {len(items)} {tipo}'
              + (f' (la API dice {total} en total, {ultima} páginas)' if total is not None else ''))

    escritos = []
    for tipo, porid in recursos.items():
        if not porid:
            continue
        items = reescribir(list(porid.values()), idx, faltantes)
        with open(os.path.join(DATOS, f'{tipo}.json'), 'w', encoding='utf-8') as fh:
            json.dump(items, fh, ensure_ascii=False, separators=(',', ':'))
        escritos.append((tipo, len(items)))

        if tipo == 'products':
            for campo, archivo in (('category', 'categories'), ('brand', 'brands')):
                derivados = reescribir(derivar(items, campo), idx, faltantes)
                with open(os.path.join(DATOS, f'{archivo}.json'), 'w', encoding='utf-8') as fh:
                    json.dump(derivados, fh, ensure_ascii=False, separators=(',', ':'))
                escritos.append((archivo, len(derivados)))

    print()
    for tipo, n in escritos:
        print(f'  data/{tipo}.json: {n}')

    for tipo, total in esperado.items():
        hay = len(recursos[tipo])
        if hay < total:
            print(f'\n  AVISO: de {tipo} faltan {total - hay}. La API pagina de 200 en 200;'
                  f'\n  pide las páginas que falten con ?page=N y vuelve a ejecutar esto'
                  f'\n  pasando todos los archivos a la vez.')

    if faltantes:
        print(f'\n  AVISO: {len(faltantes)} imágenes referenciadas no están en storage/.'
              f'\n  Se dejan apuntando al backend. Ejemplo: {sorted(faltantes)[0]}')


if __name__ == '__main__':
    main(sys.argv[1:])

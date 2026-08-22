/* ==========================================================================
   agenda.js — formulario de citas de la landing de contacto
   · Validación propia con mensajes claros y accesibles.
   · Los datos NO viajan a ningún servidor: se guardan solo en este navegador.
   · Minimización de datos: el teléfono se guarda enmascarado y ni el correo
     ni las notas se almacenan.
   · Nunca se inserta HTML dinámico (solo textContent) para evitar XSS.
   Convención del proyecto: `const` por defecto, `let` solo por excepción.
   ========================================================================== */

'use strict';

(() => {
  const CLAVE_ALMACEN = 'sazon-calena.citas.v1';
  const HORAS_MINIMAS_DE_ANTICIPACION = 2;
  const DIAS_MAXIMOS = 60;
  const PASO_MINUTOS = 30;

  const SERVICIOS = Object.freeze([
    { id: 'recoger', emoji: '🛍️', nombre: 'Pedido para recoger', detalle: 'Lo dejamos pesado y empacado' },
    { id: 'domicilio', emoji: '🛵', nombre: 'Domicilio programado', detalle: 'Sur y centro de Cali' },
    { id: 'asesoria', emoji: '🔥', nombre: 'Asesoría para tu asado', detalle: '15 minutos con el maestro parrillero' },
    { id: 'empresa', emoji: '🧾', nombre: 'Pedido empresarial', detalle: 'Con factura electrónica y NIT' }
  ]);

  /* ------------------------- Referencias del DOM ------------------------- */
  const formulario = document.getElementById('form-cita');
  if (!formulario) { return; }

  const zonaMensajes = document.getElementById('zona-mensajes');
  const contenedorServicios = document.getElementById('opciones-servicio');
  const campoFecha = document.getElementById('fecha');
  const campoHora = document.getElementById('hora');
  const ayudaHora = document.getElementById('ayuda-hora');
  const listaCitas = document.getElementById('lista-citas');
  const avisoSinCitas = document.getElementById('sin-citas');
  const botonBorrarTodo = document.getElementById('borrar-todo');

  /* ---------------------------- Utilidades ---------------------------- */

  /** Quita caracteres de control, recorta espacios y limita la longitud. */
  const limpiar = (texto, maximo) => String(texto)
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maximo);

  /** Fecha en formato AAAA-MM-DD usando la hora local (no UTC). */
  const aTextoFecha = (fecha) => {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  };

  /** Convierte "2026-08-25" en un Date local, sin desfase de zona horaria. */
  const desdeTextoFecha = (texto) => {
    const partes = texto.split('-').map(Number);
    return new Date(partes[0], partes[1] - 1, partes[2]);
  };

  const fechaLegible = (texto) => desdeTextoFecha(texto)
    .toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

  /** Deja visibles solo los tres últimos dígitos del teléfono. */
  const enmascararTelefono = (telefono) => {
    const digitos = telefono.replace(/\D/g, '');
    return `•••••• ${digitos.slice(-3)}`;
  };

  /** Código de reserva con aleatoriedad criptográfica del navegador. */
  const generarCodigo = () => {
    const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const azar = new Uint32Array(5);
    window.crypto.getRandomValues(azar);

    const letras = Array.from(azar, (valor) => alfabeto[valor % alfabeto.length]).join('');
    return `SC-${letras}`;
  };

  /* ----------------------- Opciones de servicio ----------------------- */

  const construirServicios = () => {
    SERVICIOS.forEach((servicio, indice) => {
      const etiqueta = Salsa.crear('label', 'opcion');

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'servicio';
      radio.value = servicio.id;
      radio.checked = indice === 0;
      /* defaultChecked mantiene la opción marcada tras un form.reset(). */
      radio.defaultChecked = indice === 0;

      const texto = Salsa.crear('span');
      texto.append(
        Salsa.crear('b', '', `${servicio.emoji} ${servicio.nombre}`),
        Salsa.crear('small', '', servicio.detalle)
      );

      etiqueta.append(radio, texto);
      contenedorServicios.appendChild(etiqueta);
    });
  };

  /* -------------------------- Horas disponibles -------------------------- */

  const limitesDeFecha = () => {
    const hoy = new Date();
    const maximo = new Date();
    maximo.setDate(maximo.getDate() + DIAS_MAXIMOS);
    return { minimo: aTextoFecha(hoy), maximo: aTextoFecha(maximo) };
  };

  /** Devuelve las horas agendables ("07:00", "07:30", …) para una fecha. */
  const horasDisponibles = (textoFecha) => {
    const fecha = desdeTextoFecha(textoFecha);
    const jornada = Salsa.HORARIOS[fecha.getDay()];
    const ahora = new Date();
    const esHoy = aTextoFecha(ahora) === textoFecha;

    /* No se agenda con menos de 2 horas de anticipación. */
    const limiteHoy = ahora.getHours() + ahora.getMinutes() / 60 + HORAS_MINIMAS_DE_ANTICIPACION;
    /* La última cita empieza 30 minutos antes de cerrar. */
    const finalizar = jornada.cierra * 60 - PASO_MINUTOS;
    const horas = [];

    let minutos = jornada.abre * 60;
    while (minutos <= finalizar) {
      const decimal = minutos / 60;
      if (!esHoy || decimal >= limiteHoy) {
        const hora = String(Math.floor(minutos / 60)).padStart(2, '0');
        const resto = String(minutos % 60).padStart(2, '0');
        horas.push(`${hora}:${resto}`);
      }
      minutos += PASO_MINUTOS;
    }

    return horas;
  };

  /** Primer día (desde hoy) que todavía tiene horas libres. */
  const primeraFechaConCupo = () => {
    const cursor = new Date();
    let intentos = 0;

    while (intentos < 8) {
      const texto = aTextoFecha(cursor);
      if (horasDisponibles(texto).length > 0) { return texto; }
      cursor.setDate(cursor.getDate() + 1);
      intentos += 1;
    }

    return aTextoFecha(new Date());
  };

  const pintarHoras = () => {
    const textoFecha = campoFecha.value;
    campoHora.textContent = '';

    const inicial = document.createElement('option');
    inicial.value = '';

    if (!textoFecha) {
      inicial.textContent = 'Seleccioná una hora';
      campoHora.appendChild(inicial);
      ayudaHora.textContent = 'Elegí primero la fecha';
      return;
    }

    const horas = horasDisponibles(textoFecha);

    if (horas.length === 0) {
      inicial.textContent = 'Sin horas disponibles ese día';
      campoHora.appendChild(inicial);
      ayudaHora.textContent = 'Ya cerramos por hoy: probá con el día siguiente 🙂';
      return;
    }

    inicial.textContent = 'Seleccioná una hora';
    campoHora.appendChild(inicial);

    horas.forEach((hora) => {
      const opcion = document.createElement('option');
      opcion.value = hora;
      opcion.textContent = `${hora} h`;
      campoHora.appendChild(opcion);
    });

    const jornada = Salsa.HORARIOS[desdeTextoFecha(textoFecha).getDay()];
    ayudaHora.textContent = `Ese día atendemos de ${jornada.texto}`;
  };

  /* ----------------------------- Validación ----------------------------- */

  const mostrarError = (idCampo, mensaje) => {
    const campo = document.getElementById(idCampo);
    const destino = document.getElementById(`error-${idCampo}`);

    if (destino) { destino.textContent = mensaje; }
    if (campo && destino) { campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false'); }
  };

  const limpiarErrores = () => {
    formulario.querySelectorAll('.error').forEach((nodo) => { nodo.textContent = ''; });
    formulario.querySelectorAll('[aria-invalid]').forEach((nodo) => {
      nodo.setAttribute('aria-invalid', 'false');
    });
  };

  /** Valida el formulario y devuelve los datos limpios o la lista de errores. */
  const validar = () => {
    const errores = [];

    const nombre = limpiar(document.getElementById('nombre').value, 60);
    const telefono = limpiar(document.getElementById('telefono').value, 20);
    const correo = limpiar(document.getElementById('correo').value, 80);
    const notas = limpiar(document.getElementById('notas').value, 400);
    const barrio = limpiar(document.getElementById('barrio').value, 40);
    const personas = Number(document.getElementById('personas-cita').value);
    const consentimiento = document.getElementById('consentimiento').checked;
    const seleccionServicio = formulario.querySelector('input[name="servicio"]:checked');
    const textoFecha = campoFecha.value;
    const hora = campoHora.value;

    if (nombre.length < 3 || !/^[\p{L}\s'.-]+$/u.test(nombre)) {
      mostrarError('nombre', 'Escribí tu nombre y apellido (solo letras).');
      errores.push('nombre');
    }

    const digitos = telefono.replace(/\D/g, '');
    if (digitos.length < 7 || digitos.length > 13) {
      mostrarError('telefono', 'Necesitamos un número válido, entre 7 y 13 dígitos.');
      errores.push('teléfono');
    }

    if (correo && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(correo)) {
      mostrarError('correo', 'Ese correo no parece válido. Podés dejarlo vacío.');
      errores.push('correo');
    }

    if (!seleccionServicio) {
      mostrarError('servicio', 'Elegí el servicio que necesitás.');
      errores.push('servicio');
    }

    if (!textoFecha) {
      mostrarError('fecha', 'Elegí la fecha de tu cita.');
      errores.push('fecha');
    } else {
      const limites = limitesDeFecha();
      if (textoFecha < limites.minimo || textoFecha > limites.maximo) {
        mostrarError('fecha', `Agendá entre hoy y los próximos ${DIAS_MAXIMOS} días.`);
        errores.push('fecha');
      }
    }

    if (!hora) {
      mostrarError('hora', 'Elegí una hora disponible.');
      errores.push('hora');
    } else if (textoFecha && !horasDisponibles(textoFecha).includes(hora)) {
      mostrarError('hora', 'Esa hora ya no está disponible. Elegí otra.');
      errores.push('hora');
    }

    if (!Number.isInteger(personas) || personas < 1 || personas > 200) {
      mostrarError('personas-cita', 'Indicá un número entre 1 y 200.');
      errores.push('número de personas');
    }

    const servicio = seleccionServicio
      ? SERVICIOS.find((opcion) => opcion.id === seleccionServicio.value)
      : null;

    if (servicio && servicio.id === 'domicilio' && !barrio) {
      mostrarError('barrio', 'Para el domicilio decinos a qué barrio de Cali vamos.');
      errores.push('barrio');
    }

    if (!consentimiento) {
      mostrarError('consentimiento', 'Necesitamos tu autorización para gestionar la cita.');
      errores.push('autorización de datos');
    }

    return {
      valido: errores.length === 0,
      errores,
      datos: { nombre, telefono, correo, notas, barrio, personas, servicio, textoFecha, hora }
    };
  };

  /* ------------------------------ Mensajes ------------------------------ */

  const limpiarMensajes = () => { zonaMensajes.textContent = ''; };

  const mensajeDeError = (errores) => {
    limpiarMensajes();

    const caja = Salsa.crear('div', 'mensaje mensaje--error');
    caja.appendChild(Salsa.crear('p', '', '⚠️ Revisá estos puntos antes de confirmar:'));

    const lista = Salsa.crear('ul');
    errores.forEach((campo) => lista.appendChild(Salsa.crear('li', '', campo)));

    caja.appendChild(lista);
    zonaMensajes.appendChild(caja);
    caja.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const mensajeDeExito = (cita, datos) => {
    limpiarMensajes();

    const primerNombre = datos.nombre.split(' ')[0];
    const caja = Salsa.crear('div', 'mensaje mensaje--exito');
    caja.appendChild(Salsa.crear('p', '', `¡Listo, ${primerNombre}! Tu cita quedó registrada. 🎉`));

    const detalle = Salsa.crear('p');
    detalle.append(
      document.createTextNode(`${cita.servicio} · ${fechaLegible(cita.fecha)} a las ${cita.hora} h · código `),
      Salsa.crear('span', 'codigo', cita.codigo)
    );
    caja.appendChild(detalle);

    /* Enlace de WhatsApp con el resumen ya escrito (texto siempre codificado). */
    const resumen = `Hola, soy ${datos.nombre}. Confirmo mi cita ${cita.codigo}: `
      + `${cita.servicio} el ${fechaLegible(cita.fecha)} a las ${cita.hora} para ${cita.personas} personas.`;

    const enlace = Salsa.crear('a', 'boton boton--negro boton--pequeno', '💬 Confirmar por WhatsApp');
    enlace.href = `https://wa.me/${Salsa.NEGOCIO.whatsapp}?text=${encodeURIComponent(resumen)}`;
    enlace.target = '_blank';
    enlace.rel = 'noopener noreferrer';
    caja.appendChild(enlace);

    zonaMensajes.appendChild(caja);
    caja.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /* --------------------------- Citas guardadas --------------------------- */

  const pintarCitas = () => {
    const citas = Salsa.almacen.leer(CLAVE_ALMACEN);

    listaCitas.textContent = '';
    avisoSinCitas.hidden = citas.length > 0;
    botonBorrarTodo.hidden = citas.length === 0;

    citas.forEach((cita) => {
      const elemento = Salsa.crear('li', 'cita');

      const detalle = Salsa.crear('div', 'cita__detalle');
      detalle.append(
        Salsa.crear('b', '', `${cita.servicio} · ${cita.personas} personas`),
        Salsa.crear('span', '', `${fechaLegible(cita.fecha)} a las ${cita.hora} h`),
        Salsa.crear('span', '', `A nombre de ${cita.nombre} · tel. ${cita.telefonoOculto}`),
        Salsa.crear('span', 'cita__codigo', cita.codigo)
      );

      const cancelar = Salsa.crear('button', 'boton-texto', 'Cancelar cita');
      cancelar.type = 'button';
      cancelar.addEventListener('click', () => {
        const seguro = window.confirm(`¿Cancelamos la cita ${cita.codigo}?`);
        if (!seguro) { return; }

        const restantes = Salsa.almacen.leer(CLAVE_ALMACEN)
          .filter((guardada) => guardada.codigo !== cita.codigo);

        Salsa.almacen.guardar(CLAVE_ALMACEN, restantes);
        pintarCitas();
      });

      elemento.append(detalle, cancelar);
      listaCitas.appendChild(elemento);
    });
  };

  /* ------------------------------ Arranque ------------------------------ */

  document.addEventListener('DOMContentLoaded', () => {
    construirServicios();

    const limites = limitesDeFecha();
    campoFecha.min = limites.minimo;
    campoFecha.max = limites.maximo;
    campoFecha.value = primeraFechaConCupo();
    pintarHoras();

    campoFecha.addEventListener('change', pintarHoras);

    /* Al corregir un campo, su mensaje de error desaparece de inmediato. */
    formulario.addEventListener('input', (evento) => {
      if (evento.target.id) { mostrarError(evento.target.id, ''); }
    });

    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      limpiarErrores();

      const revision = validar();
      if (!revision.valido) {
        mensajeDeError(revision.errores);
        return;
      }

      const { datos } = revision;

      /* Minimización de datos: no guardamos correo ni notas, y el teléfono
         queda enmascarado. Lo justo para reconocer la cita, nada más. */
      const cita = {
        codigo: generarCodigo(),
        nombre: datos.nombre,
        telefonoOculto: enmascararTelefono(datos.telefono),
        servicio: datos.servicio.nombre,
        fecha: datos.textoFecha,
        hora: datos.hora,
        personas: datos.personas
      };

      const citas = Salsa.almacen.leer(CLAVE_ALMACEN);
      citas.unshift(cita);
      const guardado = Salsa.almacen.guardar(CLAVE_ALMACEN, citas.slice(0, 20));

      mensajeDeExito(cita, datos);
      if (guardado) { pintarCitas(); }

      formulario.reset();
      campoFecha.value = primeraFechaConCupo();
      pintarHoras();
    });

    botonBorrarTodo.addEventListener('click', () => {
      const seguro = window.confirm('Esto borra todas tus citas guardadas en este dispositivo. ¿Seguimos?');
      if (!seguro) { return; }

      Salsa.almacen.borrar(CLAVE_ALMACEN);
      pintarCitas();
      limpiarMensajes();
    });

    pintarCitas();
  });
})();

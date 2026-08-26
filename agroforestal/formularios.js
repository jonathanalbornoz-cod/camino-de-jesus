/*
 * formularios.js — envía por correo las cotizaciones y las solicitudes de servicio.
 *
 * Una página estática no puede enviar correo por sí misma: no hay servidor que lo haga.
 * Antes esos dos formularios los recibía el backend, que era quien mandaba el correo.
 * Aquí los recoge un servicio de reenvío (FormSubmit por omisión) que los entrega en la
 * dirección configurada en data/settings.json.
 *
 * offline-api.js intercepta los POST a /quotes y /service-requests y llama a
 * window.__agroEnviarFormulario. Si este archivo no está cargado, esos POST salen al
 * backend como siempre.
 *
 * ACTIVACIÓN: la primera vez que alguien envíe algo, el servicio manda un correo de
 * confirmación a la dirección de destino. Hasta que se pulse ese enlace, los envíos
 * fallan y entra el plan B: se le ofrece al cliente mandarlo por correo o por WhatsApp,
 * con todo ya redactado, para no perder la solicitud.
 */
(function () {
  'use strict';

  var TIPOS = {
    cotizacion: { asunto: 'Cotización desde la web', titulo: 'tu cotización' },
    servicio: { asunto: 'Solicitud de servicio técnico desde la web', titulo: 'tu solicitud' }
  };

  var SERVICIOS = {
    maintenance: 'Mantenimiento preventivo',
    repair: 'Reparación',
    diagnosis: 'Diagnóstico',
    other: 'Otro'
  };

  var config = null;

  function raiz() {
    var base = document.querySelector('base');
    return base ? base.getAttribute('href') : '/';
  }

  var ajustes = fetch(raiz() + 'data/settings.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (s) { config = (s && s.formularios) || null; return s; })
    .catch(function () { return null; });

  var whatsapp = null;
  ajustes.then(function (s) {
    whatsapp = ((s && s.whatsapp) || '').replace(/[^0-9]/g, '') || null;
  });

  // --- el mensaje ------------------------------------------------------------

  function limpio(v) {
    return v === null || v === undefined || v === '' ? null : String(v).trim();
  }

  // Pares en el orden en que se quieren leer en el correo. FormSubmit los pinta como
  // una tabla respetando este orden.
  function campos(tipo, d) {
    var pares = [
      ['Nombre', limpio(d.name)],
      ['Correo', limpio(d.email)],
      ['Teléfono', limpio(d.phone)]
    ];

    if (tipo === 'cotizacion') {
      var items = d.items || [];
      pares.push(['Productos', items.map(function (i, n) {
        return (n + 1) + '. ' + i.product_name + ' — cantidad: ' + i.quantity;
      }).join('\n') || null]);
      pares.push(['Notas', limpio(d.notes)]);
    } else {
      pares.push(['Tipo de servicio', SERVICIOS[d.service_type] || limpio(d.service_type)]);
      pares.push(['Marca del equipo', limpio(d.equipment_brand)]);
      pares.push(['Modelo', limpio(d.equipment_model)]);
      pares.push(['Descripción del problema', limpio(d.problem_description)]);
    }

    return pares.filter(function (p) { return p[1]; });
  }

  function comoTexto(tipo, d) {
    return campos(tipo, d).map(function (p) {
      return p[0] + ': ' + p[1];
    }).join('\n');
  }

  // --- envío -----------------------------------------------------------------

  function enviar(tipo, datos) {
    if (!config || !config.endpoint) return Promise.resolve(null);   // sin configurar: al backend

    var cuerpo = {
      _subject: TIPOS[tipo].asunto + (datos.name ? ' — ' + datos.name : ''),
      _template: 'table',
      _captcha: 'false'
    };
    if (datos.email) cuerpo._replyto = datos.email;                  // responder va al cliente
    campos(tipo, datos).forEach(function (p) { cuerpo[p[0]] = p[1]; });
    cuerpo['Enviado desde'] = location.href;

    return fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(cuerpo)
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; })
          .then(function (j) { return { ok: r.ok, json: j }; });
      })
      .then(function (res) {
        // FormSubmit responde 200 con success:"false" cuando la dirección aún no se ha
        // confirmado, así que no basta con mirar el código HTTP.
        var bien = res.ok && String(res.json.success) !== 'false';
        if (bien) return { __respuesta: true, status: 200, body: { message: 'ok' } };

        planB(tipo, datos);
        return {
          __respuesta: true,
          status: 502,
          body: { message: 'No pudimos enviar ' + TIPOS[tipo].titulo + ' automáticamente. Te abrimos otra forma de hacérnosla llegar.' }
        };
      })
      .catch(function () {
        planB(tipo, datos);
        return {
          __respuesta: true,
          status: 502,
          body: { message: 'No pudimos enviar ' + TIPOS[tipo].titulo + ' automáticamente. Te abrimos otra forma de hacérnosla llegar.' }
        };
      });
  }

  // --- plan B: que el cliente no se quede sin poder mandarla ------------------

  function planB(tipo, datos) {
    var texto = comoTexto(tipo, datos);
    var asunto = TIPOS[tipo].asunto + (datos.name ? ' — ' + datos.name : '');
    var destino = (config && config.destino) || '';

    var fondo = document.createElement('div');
    fondo.style.cssText =
      'position:fixed;inset:0;z-index:9999;background:rgba(31,18,9,.6);' +
      'display:flex;align-items:center;justify-content:center;padding:1.5rem';

    var caja = document.createElement('div');
    caja.style.cssText =
      'background:#fff;border-radius:1rem;max-width:30rem;width:100%;padding:1.75rem;' +
      'box-shadow:0 25px 50px -12px rgba(0,0,0,.4);font-family:inherit;color:#3B2A1A';

    var h = document.createElement('h3');
    h.textContent = 'Envíanos ' + TIPOS[tipo].titulo + ' por aquí';
    h.style.cssText = 'margin:0 0 .5rem;font-size:1.25rem;font-weight:700';

    var p = document.createElement('p');
    p.textContent = 'No pudimos enviarla automáticamente. Elige cómo prefieres hacérnosla llegar: ya va escrita, sólo tienes que confirmarla.';
    p.style.cssText = 'margin:0 0 1.25rem;font-size:.9rem;line-height:1.5;color:#6B5644';

    var acciones = document.createElement('div');
    acciones.style.cssText = 'display:flex;flex-direction:column;gap:.6rem';

    function boton(etiqueta, fondoColor, alPulsar) {
      var b = document.createElement('a');
      b.textContent = etiqueta;
      b.style.cssText =
        'display:block;text-align:center;padding:.8rem 1rem;border-radius:.6rem;' +
        'font-weight:700;font-size:.85rem;text-decoration:none;cursor:pointer;' +
        'background:' + fondoColor + ';color:#fff';
      b.addEventListener('click', alPulsar);
      return b;
    }

    if (destino) {
      var correo = boton('Enviar por correo', '#F36821', function () {
        location.href = 'mailto:' + destino +
          '?subject=' + encodeURIComponent(asunto) +
          '&body=' + encodeURIComponent(texto);
      });
      acciones.appendChild(correo);
    }

    if (whatsapp) {
      acciones.appendChild(boton('Enviar por WhatsApp', '#22c55e', function () {
        window.open('https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(asunto + '\n\n' + texto), '_blank', 'noopener');
      }));
    }

    var copiar = boton('Copiar los datos', '#3B2A1A', function () {
      var previo = copiar.textContent;
      var ok = function () { copiar.textContent = 'Copiado'; setTimeout(function () { copiar.textContent = previo; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(texto).then(ok, ok);
      else ok();
    });
    acciones.appendChild(copiar);

    var cerrar = document.createElement('button');
    cerrar.textContent = 'Cerrar';
    cerrar.style.cssText =
      'margin-top:1rem;width:100%;background:none;border:0;color:#A08060;' +
      'font-size:.8rem;cursor:pointer;font-family:inherit';
    cerrar.addEventListener('click', function () { fondo.remove(); });

    caja.appendChild(h);
    caja.appendChild(p);
    caja.appendChild(acciones);
    caja.appendChild(cerrar);
    fondo.appendChild(caja);
    fondo.addEventListener('click', function (e) { if (e.target === fondo) fondo.remove(); });
    document.body.appendChild(fondo);
  }

  // --- enganche con offline-api.js -------------------------------------------

  window.__agroEnviarFormulario = function (tipo, datos) {
    if (!TIPOS[tipo] || !datos) return Promise.resolve(null);
    return ajustes.then(function () { return enviar(tipo, datos); });
  };
})();

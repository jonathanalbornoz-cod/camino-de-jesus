<?php
/**
 * Recibe los formularios de contacto.html y envia el contenido por correo.
 * Responde JSON cuando lo llama fetch(); si el visitante tiene JavaScript
 * desactivado, el formulario se envia normal y aqui se redirige de vuelta.
 */

const DESTINO   = 'ciudadjardinodontologia@gmail.com';
// El remitente debe ser una direccion del propio dominio: los proveedores
// rechazan o marcan como spam el correo que dice venir de otro dominio.
const REMITENTE = 'no-reply@odontologiaciudadjardin.com';

function responder(int $codigo, bool $ok, string $mensaje): void
{
    $pideJson = (isset($_SERVER['HTTP_X_REQUESTED_WITH'])
                 && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
        || (isset($_SERVER['HTTP_ACCEPT']) && str_contains($_SERVER['HTTP_ACCEPT'], 'application/json'));

    if ($pideJson) {
        http_response_code($codigo);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['ok' => $ok, 'mensaje' => $mensaje], JSON_UNESCAPED_UNICODE);
        return;
    }
    header('Location: contacto.html?envio=' . ($ok ? 'ok' : 'error'), true, 303);
}

/** Quita saltos de linea: evita que alguien inyecte cabeceras extra. */
function limpiarCabecera(string $v): string
{
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v));
}

function campo(string $nombre): string
{
    return trim((string) ($_POST[$nombre] ?? ''));
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    responder(405, false, 'Metodo no permitido.');
    exit;
}

// Trampa para bots: el campo va oculto, una persona nunca lo rellena.
if (campo('website') !== '' || campo('website_pqrs') !== '') {
    responder(200, true, 'Gracias, hemos recibido tu mensaje.');
    exit;
}

$tipo   = campo('formulario') === 'pqrs' ? 'pqrs' : 'cita';
$nombre = campo('nombre');
$email  = campo('email');

if ($nombre === '' || $email === '') {
    responder(422, false, 'Faltan datos obligatorios.');
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(422, false, 'El correo electronico no es valido.');
    exit;
}

if ($tipo === 'pqrs') {
    $asunto = 'PQRS desde la web - ' . (campo('tipo_solicitud') ?: 'Sin clasificar');
    $lineas = [
        'Tipo de solicitud: ' . campo('tipo_solicitud'),
        'Nombre: '            . $nombre,
        'Correo: '            . $email,
        '',
        'Comentario:',
        campo('mensaje'),
    ];
} else {
    $asunto = 'Solicitud de valoracion - ' . ($nombre ?: 'sin nombre');
    $lineas = [
        'Nombre: '             . $nombre,
        'Telefono: '           . campo('telefono'),
        'Correo: '             . $email,
        'Asunto: '             . campo('asunto'),
        'Fecha preferida: '    . campo('fecha'),
        'Tipo de tratamiento: '. campo('servicio'),
        '',
        'Mensaje:',
        campo('mensaje'),
    ];
}

$cuerpo = implode("\n", $lineas) . "\n\n--\nEnviado desde odontologiaciudadjardin.com\n";

$cabeceras = implode("\r\n", [
    'From: Odontologia Ciudad Jardin <' . REMITENTE . '>',
    'Reply-To: ' . limpiarCabecera($nombre) . ' <' . limpiarCabecera($email) . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
]);

$enviado = mail(DESTINO, limpiarCabecera($asunto), $cuerpo, $cabeceras, '-f' . REMITENTE);

if ($enviado) {
    responder(200, true, 'Gracias, hemos recibido tu mensaje. Te contactaremos pronto.');
} else {
    responder(500, false, 'No pudimos enviar el mensaje. Escribenos por WhatsApp.');
}

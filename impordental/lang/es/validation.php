<?php

// Mensajes de validación en español para los formularios de la tienda
// (registro, ingreso, cotización y contacto). Requiere APP_LOCALE=es.

return [
    'confirmed' => 'La confirmación de :attribute no coincide.',
    'email' => 'Escribe un :attribute válido.',
    'integer' => 'El campo :attribute debe ser un número entero.',
    'max' => [
        'numeric' => 'El campo :attribute no puede ser mayor que :max.',
        'string' => 'El campo :attribute no puede tener más de :max caracteres.',
    ],
    'min' => [
        'numeric' => 'El campo :attribute debe ser al menos :min.',
        'string' => 'El campo :attribute debe tener al menos :min caracteres.',
    ],
    'prohibited' => 'El campo :attribute no está permitido.',
    'required' => 'El campo :attribute es obligatorio.',
    'string' => 'El campo :attribute debe ser texto.',
    'unique' => 'Ya existe una cuenta con ese :attribute.',

    'attributes' => [
        'email' => 'correo',
        'password' => 'contraseña',
        'name' => 'nombre',
        'phone' => 'teléfono',
        'cantidad' => 'cantidad',
        'notes' => 'comentarios',
        'message' => 'mensaje',
    ],
];

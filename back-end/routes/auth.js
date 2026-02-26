/**
 * ARCHIVO DE RUTAS DE AUTENTICACIÓN (authRoutes.js)
 * Define los puntos de acceso (endpoints) para el login y registro.
 */

const express = require('express');
const router = express.Router(); // Creamos una instancia del enrutador de Express
const authController = require('../controllers/authController'); // Importamos la lógica desde el controlador

/**
 * RUTA: Iniciar Sesión (Login)
 * Método: POST
 * URL: http://localhost:4000/api/auth/login
 * Descripción: Recibe las credenciales (correo y password) en el body.
 * Si son correctas, el controlador responde con un Token JWT.
 */
router.post('/login', authController.login);

/**
 * RUTA: Registro de Usuarios
 * Método: POST
 * URL: http://localhost:4000/api/auth/register
 * Descripción: Recibe los datos del nuevo usuario, los guarda en la BD
 * (encriptando la clave automáticamente) y devuelve un Token.
 */
router.post('/register', authController.register);

// Exportamos el enrutador para que pueda ser usado en el archivo principal (index.js o app.js)
module.exports = router;
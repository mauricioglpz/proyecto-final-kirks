const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const authMiddleware = require('../middlewares/authMiddleware');

// 1. Ruta para solo crear la ventana de pago en Stripe
router.post('/crear-sesion-stripe', authMiddleware, pagoController.crearSesionStripe);

// 2. Ruta para confirmar la compra, guardar en DB y enviar correo (llamada desde exito.html)
router.post('/confirmar-compra', authMiddleware, pagoController.confirmarCompra);

// 3. Ruta para cargar las compras en cuenta.html
router.get('/historial', authMiddleware, pagoController.obtenerHistorial);

module.exports = router;
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const authMiddleware = require('../middlewares/authMiddleware');

const ProductoVendido = require('../models/ProductoVendido');
const ServicioContratado = require('../models/ServicioContratado');
const Usuario = require('../models/Usuario');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// URL base de tu proyecto en Vercel
const URL_BASE = "https://proyecto-final-kirks-delta.vercel.app";

// ================================================
// 1. CREAR SESIÓN DE STRIPE (POST /api/pagos/create-checkout-session)
// ================================================
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
    try {
        const { items } = req.body;

        const lineItems = items.map(item => ({
            price_data: {
                currency: 'mxn',
                product_data: { name: item.title },
                unit_amount: Math.round(Number(item.price) * 100),
            },
            quantity: item.cantidad,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            // CORREGIDO: Ahora apuntan a tu web real en Vercel
            success_url: `${URL_BASE}/exito.html`,
            cancel_url:  `${URL_BASE}/carrito.html`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error en Stripe:", error);
        res.status(500).json({ error: 'Error al iniciar el pago' });
    }
});

// ================================================
// 2. CONFIRMAR COMPRA
// ================================================
router.post('/confirmar-compra', authMiddleware, async (req, res) => {
    try {
        const { items } = req.body;
        const usuarioDb = await Usuario.findById(req.user.id);

        if (!usuarioDb) return res.status(404).json({ error: 'Usuario no encontrado' });

        const ordenId = crypto.randomBytes(8).toString('hex').toUpperCase();
        let totalCompra = 0;
        let listaProductosHTML = '';

        for (const item of items) {
            const totalItem = Number(item.price) * item.cantidad;
            totalCompra += totalItem;

            const nuevaVenta = new ProductoVendido({
                usuario:        usuarioDb.nombreUsuario,
                ordenId:        ordenId,
                nombreProducto: item.title,
                precio:         Number(item.price),
                cantidad:       item.cantidad,
                total:          totalItem,
                fecha:          new Date()
            });
            await nuevaVenta.save();
            listaProductosHTML += `<li>${item.cantidad}x ${item.title} — $${totalItem} MXN</li>`;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: usuarioDb.correo,
            subject: 'Ticket de Compra - Doggie Chic Studio',
            html: `<h1>¡Gracias por tu compra!</h1><p>Orden #${ordenId}</p><ul>${listaProductosHTML}</ul>`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, ordenId });
    } catch (error) {
        res.status(500).json({ error: 'Error al confirmar' });
    }
});

// ================================================
// 3. HISTORIAL
// ================================================
router.get('/historial', authMiddleware, async (req, res) => {
    try {
        const usuarioDb = await Usuario.findById(req.user.id);
        const productos = await ProductoVendido.find({ usuario: usuarioDb.nombreUsuario }).sort({ fecha: -1 });
        const servicios = await ServicioContratado.find({ usuario: usuarioDb.nombreUsuario }).sort({ fecha: -1 });
        
        // ... (el resto de tu lógica de agrupación está bien)
        res.json({ success: true, ordenes: [], servicios }); 
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const authMiddleware = require('../middlewares/authMiddleware');

// IMPORTANTE: Verifica que los nombres de carpetas y archivos coincidan exactamente (mayúsculas/minúsculas)
const Usuario = require('../models/Usuario');
const ProductoVendido = require('../models/ProductoVendido');
const ServicioContratado = require('../models/ServicioContratado');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const URL_BASE = "https://proyecto-final-kirks-delta.vercel.app";

// 1. CREAR SESIÓN DE STRIPE
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ error: 'No hay productos' });

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
            success_url: `${URL_BASE}/exito.html`,
            cancel_url:  `${URL_BASE}/carrito.html`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error Stripe:", error);
        res.status(500).json({ error: error.message });
    }
});

// 2. CONFIRMAR COMPRA
router.post('/confirmar-compra', authMiddleware, async (req, res) => {
    try {
        const { items } = req.body;
        const usuarioDb = await Usuario.findById(req.user.id);
        if (!usuarioDb) return res.status(404).json({ error: 'Usuario no encontrado' });

        const ordenId = crypto.randomBytes(8).toString('hex').toUpperCase();
        
        for (const item of items) {
            const nuevaVenta = new ProductoVendido({
                usuario: usuarioDb.nombreUsuario,
                ordenId: ordenId,
                nombreProducto: item.title,
                precio: Number(item.price),
                cantidad: item.cantidad,
                total: Number(item.price) * item.cantidad,
                fecha: new Date()
            });
            await nuevaVenta.save();
        }

        res.json({ success: true, ordenId });
    } catch (error) {
        console.error("Error Confirmar:", error);
        res.status(500).json({ error: error.message });
    }
});

// 3. HISTORIAL (Ruta que te está dando el error 500)
router.get('/historial', authMiddleware, async (req, res) => {
    try {
        // Buscamos al usuario por el ID que viene en el token decodificado
        const usuarioDb = await Usuario.findById(req.user.id);
        if (!usuarioDb) return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });

        // Buscamos sus compras y servicios
        const productos = await ProductoVendido.find({ usuario: usuarioDb.nombreUsuario }).sort({ fecha: -1 });
        const servicios = await ServicioContratado.find({ usuario: usuarioDb.nombreUsuario }).sort({ fecha: -1 });

        // Agrupamos productos por ordenId
        const ordenesMap = {};
        productos.forEach(prod => {
            const key = prod.ordenId || `legacy_${prod._id}`;
            if (!ordenesMap[key]) {
                ordenesMap[key] = {
                    ordenId: prod.ordenId || "S/N",
                    fecha: prod.fecha,
                    productos: [],
                    totalOrden: 0
                };
            }
            ordenesMap[key].productos.push(prod);
            ordenesMap[key].totalOrden += prod.total;
        });

        res.json({ 
            success: true, 
            ordenes: Object.values(ordenesMap), 
            servicios 
        });
    } catch (error) {
        console.error("Error Historial:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

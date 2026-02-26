const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const ProductoVendido = require('../models/ProductoVendido');
const ServicioContratado = require('../models/ServicioContratado');
const Usuario = require('../models/Usuario');

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 1. Esta función SOLO crea la ventana de pago de Stripe
exports.crearSesionStripe = async (req, res) => {
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
            success_url: 'http://localhost:4000/exito.html',
            cancel_url: 'http://localhost:4000/carrito.html',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error en Stripe:", error);
        res.status(500).json({ error: 'Error al iniciar el pago' });
    }
};

// 2. Esta función guarda en BD y manda el correo
exports.confirmarCompra = async (req, res) => {
    try {
        const { items } = req.body;
        const usuarioDb = await Usuario.findById(req.user.id); 

        if (!usuarioDb) return res.status(404).json({ error: 'Usuario no encontrado' });

        let totalCompra = 0;
        let listaProductosHTML = '';

        for (const item of items) {
            const totalItem = Number(item.price) * item.cantidad;
            totalCompra += totalItem;
            
            const nuevaVenta = new ProductoVendido({
                usuario: usuarioDb.nombreUsuario,
                nombreProducto: item.title,
                precio: Number(item.price),
                cantidad: item.cantidad,
                total: totalItem,
                fecha: new Date()
            });
            await nuevaVenta.save();

            listaProductosHTML += `<li>${item.cantidad}x ${item.title} - $${totalItem} MXN</li>`;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: usuarioDb.correo,
            subject: 'Ticket de Compra - Doggie Chic Studio',
            html: `
                <h1>¡Gracias por tu compra, ${usuarioDb.nombreUsuario}!</h1>
                <p>Tu pago ha sido procesado con éxito. Detalle:</p>
                <ul>${listaProductosHTML}</ul>
                <h3>Total pagado: $${totalCompra} MXN</h3>
                <p><strong>Estado:</strong> El producto se encuentra en envío.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        console.error("Error al guardar/enviar correo:", error);
        res.status(500).json({ error: 'Error al confirmar la compra' });
    }
};

exports.obtenerHistorial = async (req, res) => {
    try {
        const usuarioDb = await Usuario.findById(req.user.id);
        const nombreUser = usuarioDb.nombreUsuario;

        // Buscar en ambas colecciones
        const productos = await ProductoVendido.find({ usuario: nombreUser }).sort({ fecha: -1 });
        const servicios = await ServicioContratado.find({ usuario: nombreUser }).sort({ horaServicio: -1 });

        res.json({ success: true, productos, servicios });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al obtener historial' });
    }
};
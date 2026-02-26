require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./db.js');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/authMiddleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pagosRoutes = require('./routes/pagos');

const Usuario = require('./models/Usuario');
const ProductoVendido = require('./models/ProductoVendido');
const ServicioContratado = require('./models/ServicioContratado');
const Mensaje = require('./models/Mensaje');
const Producto = require('./models/Producto'); 

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();
app.use(cors());
app.use(express.json());
app.use(passport.initialize()); 

// ================================================
// CONFIGURACIÓN DE PASSPORT (GOOGLE Y GITHUB)
// ================================================

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://proyecto-final-kirks-delta.vercel.app/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let usuario = await Usuario.findOne({ correo: profile.emails[0].value });
        if (!usuario) {
            usuario = new Usuario({
                nombreUsuario: profile.displayName,
                correo: profile.emails[0].value,
                password: "oauth_account_google",
                metodoRegistro: 'Google',
                role: 'user'
            });
            await usuario.save();
        }
        return done(null, usuario);
    } catch (err) {
        return done(err, null);
    }
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://proyecto-final-kirks-delta.vercel.app/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let correoGH = profile.emails ? profile.emails[0].value : `${profile.username}@github.com`;
        let usuario = await Usuario.findOne({ correo: correoGH });
        if (!usuario) {
            usuario = new Usuario({
                nombreUsuario: profile.displayName || profile.username,
                correo: correoGH,
                password: "oauth_account_github",
                metodoRegistro: 'GitHub',
                role: 'user'
            });
            await usuario.save();
        }
        return done(null, usuario);
    } catch (err) {
        return done(err, null);
    }
  }
));

// ================================================
// RUTAS DE AUTENTICACIÓN (OAUTH)
// ================================================

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login.html' }),
  (req, res) => {
    const token = jwt.sign(
        { id: req.user._id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    res.redirect(`/index.html?login_oauth=true&user=${encodeURIComponent(req.user.nombreUsuario)}&token=${token}&role=${req.user.role}`);
  }
);

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { session: false, failureRedirect: '/login.html' }),
  (req, res) => {
    const token = jwt.sign(
        { id: req.user._id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    res.redirect(`/index.html?login_oauth=true&user=${encodeURIComponent(req.user.nombreUsuario)}&token=${token}&role=${req.user.role}`);
  }
);

app.use('/api/auth', authRoutes);
app.use('/api/pagos', pagosRoutes);

// MIDDLEWARE: verificar que el usuario es ADMIN
function soloAdmin(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'Sin token, acceso denegado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ msg: 'Acceso denegado: no eres admin' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token inválido' });
    }
}

// LOGIN MANUAL
app.post('/api/auth/login', async (req, res) => {
    try {
        const { correo, password } = req.body;
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(401).json({ msg: 'Credenciales incorrectas' });
        }

        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(401).json({ msg: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            { id: usuario._id, role: usuario.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            nombre: usuario.nombreUsuario,
            role: usuario.role 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

// CRUD DE PRODUCTOS
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find().sort({ createdAt: -1 });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/productos', soloAdmin, async (req, res) => {
    try {
        const { title, price, cat, tags, desc, img } = req.body;
        const nuevo = new Producto({ title, price, cat, tags, desc, img });
        await nuevo.save();
        res.status(201).json({ success: true, producto: nuevo });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/productos/:id', soloAdmin, async (req, res) => {
    try {
        const actualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!actualizado) return res.status(404).json({ msg: 'Producto no encontrado' });
        res.json({ success: true, producto: actualizado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/productos/:id', soloAdmin, async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ success: true, msg: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SERVICIOS Y VENTAS
app.post('/api/servicios/contratar', authMiddleware, async (req, res) => {
    try {
        const { usuario, tipoServicio, precio } = req.body;
        const nuevoServicio = new ServicioContratado({
            usuario,
            tipoServicio,
            precio,
            fecha: new Date()
        });
        await nuevoServicio.save();
        res.status(201).json({ success: true, msj: 'Servicio guardado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/productos/vender', authMiddleware, async (req, res) => {
    try {
        const { usuario, producto, precio, cantidad } = req.body;
        const nuevaVenta = new ProductoVendido({
            usuario,
            nombreProducto: producto,
            precio,
            cantidad: cantidad || 1,
            total: precio * (cantidad || 1),
            fecha: new Date()
        });
        await nuevaVenta.save();
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/contacto', async (req, res) => {
    try {
        const nuevoMensaje = new Mensaje(req.body);
        await nuevoMensaje.save();
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// IMPORTANTE: En Vercel no necesitamos servir el front-end desde Express 
// ya que el vercel.json maneja las rutas estáticas por nosotros.

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});

module.exports = app;

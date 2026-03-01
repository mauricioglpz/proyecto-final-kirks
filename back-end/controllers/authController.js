/**
 * CONTROLADOR DE AUTENTICACIÓN
 * Maneja las operaciones de inicio de sesión y registro de usuarios.
 */

const Usuario = require('../models/Usuario'); // Modelo de datos del usuario
const jwt = require('jsonwebtoken');          // Librería para generar tokens de seguridad
const bcrypt = require('bcryptjs');           // Librería para comparar contraseñas encriptadas

/**
 * @desc    Autenticar usuario y obtener token (Login)
 * @route   POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        // 1. Extraer credenciales del cuerpo de la petición
        const { correo, password } = req.body; 
        
        // 2. Verificar si el usuario existe en la base de datos por su correo
        const user = await Usuario.findOne({ correo });
        if (!user) {
            return res.status(404).json({ msg: "Usuario no existe" });
        }

        // 3. Comparar la contraseña ingresada con la contraseña encriptada en la BD
        // Nota: bcrypt.compare devuelve un booleano. 
        // Importante: Si la contraseña en la BD no está encriptada (texto plano), esto fallará.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Contraseña incorrecta" });
        }

        // 4. Generar el JSON Web Token (JWT)
        // Se incluye el ID del usuario y su rol en el "payload" (carga útil) del token
        const token = jwt.sign(
            { id: user._id, role: user.role || 'user' }, 
            process.env.JWT_SECRET, // Llave secreta definida en las variables de entorno (.env)
            { expiresIn: '8h' }     // El token expirará en 8 horas
        );

        // 5. Responder con el token y datos básicos del usuario
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                nombreUsuario: user.nombreUsuario, 
                role: user.role || 'user' 
            },
            role: user.role || 'user'
        });

    } catch (error) {
        console.error("Error en Login:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        // 1. Obtener datos del cuerpo de la petición
        const { nombreUsuario, correo, password, role } = req.body;
        
        // 2. Crear una nueva instancia del modelo Usuario
        // Se asume que el modelo tiene un middleware (pre-save) que encripta la contraseña
        const nuevoUsuario = new Usuario({ nombreUsuario, correo, password, role });
        
        // 3. Guardar en la base de datos
        await nuevoUsuario.save();

        // 4. Generar token JWT inmediatamente después del registro para iniciar sesión automática
        const token = jwt.sign(
            { id: nuevoUsuario._id, role: nuevoUsuario.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );

        // 5. Enviar respuesta de éxito (201 - Creado)
        res.status(201).json({ success: true, token });

    } catch (error) {
        // Manejo de errores (ej. correo duplicado o datos faltantes)
        res.status(400).json({ success: false, error: error.message });
    }
};

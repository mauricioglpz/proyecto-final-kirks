/**
 * MIDDLEWARE DE AUTENTICACIÓN (auth.js)
 * Este script se ejecuta antes de llegar a las rutas protegidas.
 * Verifica si el cliente envía un token válido en la cabecera.
 */

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Extraer el token del header de la petición.
    // Usaremos 'x-auth-token' como estándar para las pruebas en Thunder Client/Postman.
    const token = req.header('x-auth-token');

    // 2. Verificar si el token existe.
    // Si no hay token, bloqueamos el acceso con un error 401 (No autorizado).
    if (!token) {
        return res.status(401).json({ msg: "No hay token, permiso no válido" });
    }

    try {
        // 3. Validar el token usando la llave secreta del servidor.
        // jwt.verify comparará el token con nuestra JWT_SECRET.
        const cifrado = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Si el token es válido, extraemos la información del usuario (id, rol, etc.)
        // y la guardamos en el objeto 'req' para que esté disponible en la siguiente función.
        req.user = cifrado;

        // 5. El token es correcto, damos paso a la siguiente función o controlador.
        next();
        
    } catch (error) {
        // 6. Si el token expiró o fue manipulado, lanzamos un error de autenticación.
        res.status(401).json({ msg: "Token no válido" });
    }
};
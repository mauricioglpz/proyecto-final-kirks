const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Librería para hashing de contraseñas

// 1. DEFINICIÓN DEL ESQUEMA (La "plantilla" de cómo luce un usuario en la BD)
const UsuarioSchema = new mongoose.Schema({
  nombreUsuario: { 
    type: String, 
    required: true // Campo obligatorio
  },
  correo: { 
    type: String, 
    required: true, 
    unique: true // No permite que dos usuarios tengan el mismo email
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], // Solo permite estos dos valores específicos
    default: 'user'          // Por defecto, todos son usuarios normales
  },
  horaRegistro: { 
    type: Date, 
    default: Date.now // Guarda automáticamente la fecha y hora actual al crearse
  },
  metodoRegistro: { 
    type: String, 
    enum: ['Formulario', 'GitHub', 'Google'], 
    default: 'Formulario' 
  }
});

// 2. MIDDLEWARE DE PRE-GUARDADO (Lógica automática antes de salvar en la DB)
/**
 * Este bloque se ejecuta automáticamente cada vez que haces un .save()
 * Su función principal es ENCRIPTAR la contraseña si es nueva o ha cambiado.
 */
UsuarioSchema.pre('save', async function() {
    // Si la contraseña no ha sido modificada (ej. solo cambiaron el nombre), 
    // saltamos este paso para no re-encriptar algo ya encriptado.
    if (!this.isModified('password')) return;

    try {
        // Generamos un 'salt' (una semilla de aleatoriedad para el hash)
        const salt = await bcrypt.genSalt(10);
        
        // Reemplazamos la contraseña en texto plano por la versión encriptada (hash)
        this.password = await bcrypt.hash(this.password, salt);
        
        // Al ser una función async, Mongoose sabe que terminó cuando la función acaba.
        // El proceso de guardado continúa automáticamente después de esto.
    } catch (error) {
        // Si hay un error en la encriptación, detenemos el proceso de guardado
        throw error; 
    }
});

// 3. EXPORTACIÓN DEL MODELO
// 'Usuario' es el nombre que usará Mongoose para crear la colección en la base de datos (usuarios)
module.exports = mongoose.model('Usuario', UsuarioSchema);



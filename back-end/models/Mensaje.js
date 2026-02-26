const mongoose = require('mongoose');

const MensajeSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  telefono: String,
  mensaje: String,
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mensaje', MensajeSchema);
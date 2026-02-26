const mongoose = require('mongoose');

const ServicioSchema = new mongoose.Schema({
  tipoServicio: String,  
  usuario: String,       
  precio: Number,
  horaServicio: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServicioContratado', ServicioSchema);
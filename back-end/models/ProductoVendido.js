const mongoose = require('mongoose');

const ProductoVendidoSchema = new mongoose.Schema({
    usuario: { type: String, default: "Usuario Invitado" },
    nombreProducto: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true, default: 1 },
    total: { type: Number },
    fecha: { type: Date, default: Date.now }
});

ProductoVendidoSchema.pre('save', function() {
   
    if (this.precio && this.cantidad) {
        this.total = this.precio * this.cantidad;
    }

});

module.exports = mongoose.model('ProductoVendido', ProductoVendidoSchema);
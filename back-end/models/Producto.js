const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    cat: { 
        type: String, 
        enum: ['cuidado', 'accesorios', 'juguetes', 'farmacia'],
        required: true 
    },
    tags: { type: String, default: '' },
    desc: { type: String, default: '' },
    img: { type: String, default: 'img/pla1.png' }
}, { timestamps: true });

module.exports = mongoose.model('Producto', ProductoSchema);
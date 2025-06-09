const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    prices:   { type: [Number], default: [] },
    desc: { type: String, required: true },
    available: { type: Boolean, required: true },
    sizes: { type: Map, of: Number },
    unique: { type: Boolean, default: false },
    set: { type: Number,  default: 0 },
    type: { type: String, enum: ['poster', 'mug', 'jewellery', 'other'], default: 'poster' }
});

const Product = mongoose.model('Product', productSchema);

module.exports =  Product ;
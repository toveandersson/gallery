const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    available: { type: Boolean, required: true },
    sizes: { type: Map, of: Number },
    unique: { type: Boolean, default: false },
    set: { type: Number,  default: 0 },
    type: { type: String, default: 'poster'}
});

const Poster = mongoose.model('Poster', productSchema, 'posters');
const Jewellery = mongoose.model('Jewellery', productSchema, 'jewellery');
const Mug = mongoose.model('Mug', productSchema, 'mugs');

module.exports = { Poster, Jewellery, Mug };
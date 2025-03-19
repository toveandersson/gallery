const mongoose = require('mongoose')

const PosterSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    available: { type: Boolean, required: true },
    sizes: { type: Map, of: Number },
})


module.exports = mongoose.model('Poster', PosterSchema)
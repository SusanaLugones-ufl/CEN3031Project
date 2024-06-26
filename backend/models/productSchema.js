const mongoose = require('mongoose')

// Schema for products
const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    image_url: {type: String, required: true},
    price_range: {type: String, required: true}
})

// Create a model for the schema and export it
const Product = mongoose.model('Product', productSchema)

module.exports = Product
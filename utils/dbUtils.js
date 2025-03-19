const mongoose = require('mongoose');
const Poster = require('../models/Poster')

async function fetchProductImages(lineItems) {
  const descriptions = lineItems.map(item => item.description);
  
  const products = await Poster.find({ name: { $in: descriptions } });

  return lineItems.map(item => {
    const product = products.find(p => p.name === item.description);
    return {
      name: item.description,
      image: product ? process.env.BASE_URL + product.image : process.env.BASE_URL+"/images/question-sign.png",  // Fallback image
      quantity: item.quantity,
      price: Math.round(item.price.unit_amount/10)
    };
  });
}

module.exports = { fetchProductImages };
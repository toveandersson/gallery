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
      price: Math.round((item.price.unit_amount/100)*item.quantity),
      currency: item.currency
    };
  });
}

async function checkIfPostersInStock(posterId, size, quantity) {
    try {
        const poster = await Poster.findOne({ id: posterId }); // Use 'id' instead of '_id'
        if (!poster) {
            return { success: false, message: `Poster with id ${posterId} not found` };
        }


        // Check if stock is sufficient
        const availableStock = poster.sizes.get(size) || 0;
        if (availableStock < quantity) {
            return { success: false, message: `${size} of poster ${posterId} is out of stock` };
        }

        return { success: true }; // Stock is fine
    } catch (error) {
        console.error("Error checking poster stock:", error);
        return { success: false, message: "Error checking stock" };
    }
}

async function updatePosterSizes(posterId, sizesToReduce) {
    try {
      const poster = await Poster.findById(posterId);
      if (!poster) {
        throw new Error("Poster not found");
      }

      // Loop through each size and reduce the quantity
      Object.keys(sizesToReduce).forEach(size => {
        if (poster.sizes.has(size)) {
          poster.sizes.set(size, Math.max(0, poster.sizes.get(size) - sizesToReduce[size]));
        }
      });
  
      await poster.save();
      console.log(`Updated poster ${posterId} sizes successfully.`);
      return poster;
    } catch (error) {
      console.error("Error updating poster sizes:", error);
      throw error;
    }
}


module.exports = { fetchProductImages, updatePosterSizes, checkIfPostersInStock };
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

// async function addMailToList(posterId,size){
//   try{
//     const poster = await Poster.findOne({ _id: posterId }); // Use 'id' instead of '_id'
//       if (!poster) {
//           return { success: false, message: `Poster with id ${posterId} not found in the database` };
//       }

//   }
// }

async function checkIfPostersInStock(posterId, size, quantity) {
  try {
      const poster = await Poster.findOne({ _id: posterId }); // Use 'id' instead of '_id'
      if (!poster) {
          return { success: false, message: `Poster with id ${posterId} not found in the database` };
      }

      const availableStock = poster.sizes.get(size) || 0;
      if (availableStock < quantity) {
          return { success: false, quantity: quantity, size: size, name: poster.name, message: `There is no longer ${quantity} of poster ${poster.name} with size ${size} in stock`};
      }

      return { success: true }; // Stock is fine
    } catch (error) {
        console.error("Error checking poster stock:", error);
        return { success: false, message: "Error checking stock" };
    }
}

async function reducePosterSizes(postersToUpdate) {
  try {
      const bulkOperations = postersToUpdate.map(({ id, sizes }) => ({
          updateOne: {
              filter: { _id: new ObjectId(id) }, // Ensure you're using the correct ID field
              update: {
                  $inc: Object.fromEntries(
                      Object.entries(sizes).map(([size, quantity]) => [`sizes.${size}`, -quantity]) // Reduce stock
                  )
              }
          }
      }));

      if (bulkOperations.length === 0) {
          throw new Error("No valid poster updates provided.");
      }

      await Poster.bulkWrite(bulkOperations);

      console.log(`Updated sizes for ${postersToUpdate.length} posters successfully.`);
      return { success: true };
  } catch (error) {
      console.error("Error updating poster sizes:", error);
      throw error;
  }
}




module.exports = { fetchProductImages, reducePosterSizes, checkIfPostersInStock };
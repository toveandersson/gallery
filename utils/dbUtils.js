const mongoose = require('mongoose');
const { Poster, Jewellery, Mug } = require('../models/Product');


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

const updateSizes = async () => {
  try {
    const posters = await Poster.find();

    for (let poster of posters) {
      if (poster.sizes && poster.sizes.size > 0) {
        // If sizes exist: overwrite values with 3 and 1 (based on existing keys)
        const newSizes = new Map();
        const sizeKeys = Array.from(poster.sizes.keys());

        if (sizeKeys.length > 0) newSizes.set(sizeKeys[0], 3);
        if (sizeKeys.length > 1) newSizes.set(sizeKeys[1], 1);

        poster.sizes = newSizes;
      } else {
        // If sizes don't exist: add default sizes
        poster.sizes = new Map([
          ['15x15', 3],
          ['20x20', 1]
        ]);
      }

      await poster.save();
      console.log(`Updated poster with ID ${poster.id}`);
    }

    console.log('All posters updated!');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

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
    console.log('poster id:: - ',posterId);
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
              filter: { _id: id }, // Ensure you're using the correct ID field
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


const fixSizeNames = async () => {
  try {
    const posters = await Poster.find();

    for (let poster of posters) {
      if (poster.sizes && poster.sizes.size > 0) {
        const updatedSizes = new Map();

        for (let [key, value] of poster.sizes.entries()) {
          // If key doesn't end in 'cm', add 'cm' to it
          if (!key.endsWith('cm')) {
            updatedSizes.set(`${key}cm`, value);
          } else {
            updatedSizes.set(key, value);
          }
        }

        poster.sizes = updatedSizes;
        await poster.save();
        console.log(`Updated size names for poster with ID ${poster.id}`);
      }
    }

    console.log('Finished updating size names!');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};



module.exports = { fetchProductImages, reducePosterSizes, checkIfPostersInStock, updateSizes, fixSizeNames };
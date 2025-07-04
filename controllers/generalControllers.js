const path = require('path');
const fs = require('fs');
const dbUtils = require('../utils/dbUtils');
const Product = require('../models/Product');


const serveHome = (req, res, next) => {   
    const filePath = path.join(__dirname, '../public', '/home', `/home.html`);
    res.sendFile(filePath, (err) => {
      if (err) next(); // Continue to 404 handler if not found
    });
}; 

// const serveFolders = (req, res, next) => {
//     const folderName = req.params.folderName;
//     const filePath = path.join(__dirname, '../public', folderName, `${folderName}.html`);

//     res.sendFile(filePath, (error) => {
//         if (error) {
//             console.error("Error sending file:", error);
//             next(error); // Forward error to centralized handler
//         }
//     });
// };
 
const updateStock = async (req, res) => {
    try {
        const { posterSizes } = req.body;
        await dbUtils.reducePosterSizes(posterSizes);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

const checkStockItem = async (req, res) => {
    try {
        const { id, size, quantity } = req.body;
        
        if (!id || !size || !quantity) {
            return res.status(400).json({ success: false, message: "Invalid request: Missing parameters." });
        }
        
        const result = await dbUtils.checkIfProductInStock(id, size, quantity);
        
        return res.json(result); // Return the result to the frontend
        
    } catch (error) {
        console.error("Error checking stock:", error);
        next(error);
    }
};

const checkStock = async (req, res) => {
    try {
        const { buyingSizesAmount } = req.body; // Expecting an array of objects
        console.log("check stock ",buyingSizesAmount);
        console.log("buying sizes gotten: ",buyingSizesAmount)
        if (!buyingSizesAmount || !Array.isArray(buyingSizesAmount)) {
            return res.status(400).json({ success: false, message: "Invalid request format" });
        }

        const insufficientStock = [];
        const lastItem = [];

        for (const item of buyingSizesAmount) {
            const result = await dbUtils.checkIfProductInStock(item.id, item.size, item.quantity);
            if (!result.success) {
                insufficientStock.push(`${item.quantity} of ${result.name} with size ${item.size}`); //${item.quantity} of 
            }
            if (result.availableStock === item.quantity){
                lastItem.push(`${result.name} with size ${item.size}`); //${result.availableStock} of 
            }
        }

        if (insufficientStock.length > 0) {
            return res.json({ success: false, message: `I'm sorry, I no longer have: \n    •${insufficientStock.join("\n    •")}\nin stock` });
        }
        if (lastItem.length > 0){
            console.log("last items: ",lastItem);
            return res.json({success: true, lastItemsLenth: lastItem.length, lastItems:`    •${lastItem.join(`\n    •`)}`})
        }

        res.json({ success: true }); // Everything is in stock
    } catch (error) {
        console.error("Error checking stock:", error);
        next(error);
    }
};

const getPriceInfo = () => {
  return {
    shippingPrices: { domestic: 18, international: 38 },
    freeShippingMin: 120
  };
};

// const getGameTags = () => {
//     return {

//     }
// }

const getProductWithIdAndType = async (req, res) => {
    try {
        const { id, productType }= req.params;
        const product = await Product.findOne({ _id: id }); // Query by your custom id
            if (!product) {
                return res.status(404).json({ msg: "Product not found" });
            }

        return res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
};

const getPoster = async (req, res) => {
    try {
        const { posterID } = req.params;
        console.log("id param for fetching poster ",posterID);

        const singlePoster = await Product.findOne({ _id: posterID });

        if (singlePoster) {
            const queryString = new URLSearchParams(singlePoster.toObject()).toString();
            res.redirect(`/product?${queryString}`);
        } else {
            res.status(404).send('Poster not found');
        }
        } catch (error) {
        console.error("❌ Error fetching poster:", error);
        next(error);
    }
};


const getAllProductsWithType = async (req, res) => {
    try {
        const { type } = req.params;
        //console.log("type: ",type);
        const query = type ? { type: type } : {};
        const products = await Product.find(query).sort({ collection: -1, id: 1 }); 
        res.status(200).json(products); 
    } catch (error) {
        console.error("Error fetching products:", error);
        next(error); 
    }
};

const getBuilds = (req, res) => {
  try {
    const buildsPath = path.join(process.cwd(), 'public', 'builds');
    const files = fs.readdirSync(buildsPath, { withFileTypes: true });

    const gameFolders = files
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    res.json(gameFolders);
  } catch (err) {
    console.error('💥 Error reading builds:', err.message);
    res.status(500).json({ error: 'Failed to list builds' });
  }
};

module.exports = {
    updateStock,
    checkStockItem,
    checkStock,
    getPoster,
    getAllProductsWithType,
    getProductWithIdAndType,
    serveHome,
    getPriceInfo,
    getBuilds
};
  
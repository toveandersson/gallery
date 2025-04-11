const path = require('path');
const dbUtils = require('../utils/dbUtils');
const Poster = require('../models/Poster')

const serveHome = (req, res, next) => {   
    const filePath = path.join(__dirname, '../public', '/home', `/index.html`);
    res.sendFile(filePath, (err) => {
      if (err) next(); // Continue to 404 handler if not found
    });
}; 

const serveFolders = (req, res, next) => {
    const folderName = req.params.folderName;
    const filePath = path.join(__dirname, '../public', folderName, `${folderName}.html`);

    res.sendFile(filePath, (error) => {
        if (error) {
            console.error("Error sending file:", error);
            next(error); // Forward error to centralized handler
        }
    });
};
 
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
        
        const result = await dbUtils.checkIfPostersInStock(id, size, quantity);
        
        return res.json(result); // Return the result to the frontend
        
    } catch (error) {
        console.error("Error checking stock:", error);
        next(error);
    }
};

const getPosterWithId = async (req, res) => {
  try {
    const posterId = req.params.id; // Extract the ID from request params
    
    const poster = await Poster.findOne({ _id: posterId }); // Query by your custom id
    if (!poster) {
      return res.status(404).json({ msg: "Poster not found" });
    }
    
    // console.log("Sending email for poster:", posterId, poster.name);
    
    
    // await sendMail(
      //   process.env.MONGO_USER,
      //   "Poster Accessed",
      //   `Someone accessed the poster: ${poster.name} (ID: ${posterId})`
      // );
      
      res.status(200).json(poster);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
};

const checkStock = async (req, res) => {
    try {
        const { buyingSizesAmount } = req.body; // Expecting an array of objects
        console.log("buying sizes gotten: ",buyingSizesAmount)
        if (!buyingSizesAmount || !Array.isArray(buyingSizesAmount)) {
            return res.status(400).json({ success: false, message: "Invalid request format" });
        }

        const insufficientStock = [];

        for (const item of buyingSizesAmount) {
            const result = await dbUtils.checkIfPostersInStock(item.id, item.size, item.quantity);
            if (!result.success) {
                insufficientStock.push(`${result.quantity} of ${result.name} with size ${result.size}`);
            }
        }

        if (insufficientStock.length > 0) {
            return res.json({ success: false, message: `There is no longer ${insufficientStock.join("or ")} in stock 😭` });
        }

        res.json({ success: true }); // Everything is in stock
    } catch (error) {
        console.error("Error checking stock:", error);
        next(error);
    }
};

const getPoster = async (req, res) => {
    try {
        const { posterID } = req.params;
        console.log("id param for fetching poster ",posterID);

        const singlePoster = await Poster.findOne({ _id: posterID });

        if (singlePoster) {
            const queryString = new URLSearchParams(singlePoster.toObject()).toString();
            res.redirect(`/product/product.html?${queryString}`);
        } else {
            res.status(404).send('Poster not found');
        }
        } catch (error) {
        console.error("❌ Error fetching poster:", error);
        next(error);

    }
};

// const getAllPosters = async (req, res) => {
//     try {
//         const posters = await Poster.find();

//         const sortedPosters = posters.sort((a, b) => a.id - (b.id)); // Sort safely
//         console.log("sortedposters: ",sortedPosters);
//         res.status(200).json(sortedPosters);
//     } catch (error) {
//         res.status(500).json({ msg: error.message });
//     }
// };

const getAllPosters = async (req, res, next) => {
    try {
      const posters = await Poster.find().sort({ id: 1 }); // Sort by custom ID ascending
  
      res.status(200).json(posters); // Send full poster objects including _id
    } catch (error) {
      console.error("Error fetching posters:", error);
      next(error); // Forward to your error middleware
    }
  };
  

module.exports = {
    serveFolders,
    updateStock,
    checkStockItem,
    checkStock,
    getPoster,
    getAllPosters,
    getPosterWithId,
    serveHome
};
  
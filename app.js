const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const sendMail = require("./mailer"); // Import the mailer function
const axios = require('axios');
require('dotenv').config();

const STRIPE_KEY = process.env.STRIPE_URI;
if (!STRIPE_KEY) {
  console.error("Stripe API key is missing!");
}
const stripe = require('stripe')(STRIPE_KEY);

// const lineItems = await stripe.checkout.sessions.listLineItems(
  //   'cs_test_a1enSAC01IA3Ps2vL32mNoWKMCNmmfUGTeEeHXI5tLCvyFNGsdG2UNA7mr'
  // );
app.use(express.static('./public'))

// ❌ Disable JSON parsing for webhooks (needed for Stripe)
app.use('/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const prices = require('./prices.json');
const postersData = require('./public/scripts/postersData');
const Poster = require('./models/Poster')
const { fetchProductImages, checkIfPostersInStock, updatePosterSizes } = require('./utils/dbUtils')
const checkoutRoutes = require('./routes/checkout'); // Import the checkout routes
const webhookRoutes = require('./routes/webhooks'); // Import the webhook routes
app.use('/', checkoutRoutes); 
app.use('/', webhookRoutes); 

//   const apiRoutes = require('./routes/api'); // Example for your other routes
//   app.use('/api', apiRoutes);
const port = process.env.PORT || 4242;

const connectDB = (url) =>{
  return mongoose.connect(url)
}

const start = async () =>{
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`hello port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}
app.post('/check-stock-item', async (req, res) => {
  try {
    const { id, size, quantity } = req.body;
    
    if (!id || !size || !quantity) {
      return res.status(400).json({ success: false, message: "Invalid request: Missing parameters." });
    }
    
    const result = await checkIfPostersInStock(id, size, quantity);
    
    return res.json(result); // Return the result to the frontend
    
  } catch (error) {
    console.error("Error checking stock:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post('/update-stock', async (req, res) => {
  const { posterSizes } = req.body;
  await updatePosterSizes(posterSizes);
});

const getAllPosters = async (req, res) => {
  try {
    const posters = await Poster.find();
    posters.forEach(poster => {
      poster.id = Number(poster.id); // Convert before sorting
  });

    const sortedPosters = posters.sort((a, b) => Number(a.id) - Number(b.id)); // Sort safely
  
    res.status(200).json(sortedPosters);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


app.post('/check-stock', async (req, res) => {
  try {
      const { buyingSizesAmount } = req.body; // Expecting an array of objects
      console.log("buying sizes gotten: ",buyingSizesAmount)
      if (!buyingSizesAmount || !Array.isArray(buyingSizesAmount)) {
          return res.status(400).json({ success: false, message: "Invalid request format" });
      }

      const insufficientStock = [];

      for (const item of buyingSizesAmount) {
          const result = await checkIfPostersInStock(item.id, item.size, item.quantity);
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
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const getPosterWithId = async (req, res) => {
  try {
    const posterId = req.params.id; // Extract the ID from request params
    
    const poster = await Poster.findOne({ id: posterId }); // Query by your custom id
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
  
const removePostersWithIds = async (req, res) => {
  try {
    const posterId = req.params.id; // Extract the ID from request params
    
    const poster = await Poster.findOne({ id: posterId }); // Query by your custom id
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
    
    // sendMail(
      //   "toveama@gmail.com",
      //   "Test Email",
      //   "This is a manual test to check if email works."
      // );
      // Add this route in your Express setup:
app.get('/getPosterWithId/:id', getPosterWithId);
app.get('/getAllPosters', getAllPosters);

// const fetchPoster = (fetchId) =>{
//     return Poster.find({id: fetchId})
//   }
//   // INSERTION IN THE DATABASE!
//   Poster.insertMany(postersData)
//       .then(() => {
//             console.log("Data inserted successfully!");
//       mongoose.connection.close();
//   })
//   .catch((err) => console.error(err));
// app.get('/postersData', (req, res) => {
//   res.json(postersData);
// });

// Serve folders as routes
app.get('/:folderName', (req, res, next) => {
  const folderName = req.params.folderName;
  const filePath = path.join(__dirname, 'public', folderName, `${folderName}.html`);
  res.sendFile(filePath, (err) => {
    if (err) next(); // Continue to 404 handler if not found
  });
});

app.get('/', (req, res, next) => {
  const filePath = path.join(__dirname, 'public', 'home', `index.html`);
  res.sendFile(filePath, (err) => {
    if (err) next(); // Continue to 404 handler if not found
  });
});
      
// app.get('/posters/:posterID', async (req, res) => {
//   try {
//     const { posterID } = req.params;

//     const singlePoster = await Poster.findOne({ id: Number(posterID) });

//     if (singlePoster) {
//           const queryString = new URLSearchParams(singlePoster.toObject()).toString();
//           res.redirect(`/product/product.html?${queryString}`);
//     } else {
//           res.status(404).send('Poster not found');
//       }
//     } catch (error) {
//       console.error("❌ Error fetching poster:", error);
//       res.status(500).send("Internal Server Error");
//   }
// });
                
                
app.get('/create-checkout-session/:amount');

start();

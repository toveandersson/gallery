const express = require('express');
const app = express();
const mongoose = require('mongoose');

const controllers = require('./controllers/generalControllers');
app.get('/', controllers.serveHome);
app.use(express.static('./public'));
// ❌ Disable JSON parsing for webhooks (needed for Stripe), OBS! above any other parsing ex json
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = require('./routes/generalRoutes');
const errorHandler = require('./middleware/errorHandler');

const checkoutRoutes = require('./routes/checkout'); // Import the checkout routes
const webhookRoutes = require('./routes/webhooks'); // Import the webhook routes
app.use(checkoutRoutes); 
app.use(webhookRoutes); 
app.use(router);
//error handler last, catch errors after all routes and middlewares
app.use(errorHandler);

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
// dont know with this?
//app.get('/create-checkout-session/:amount');

// function i dont know how it works, adds to poster
const addSizesToData = 
//const postersData = require('./public/scripts/postersData');
//const Poster = require('./models/Poster')
//
// const fetchPoster = (fetchId) =>{
//       return Poster.find({id: fetchId})
//     }
//     // INSERTION IN THE DATABASE!
//     Poster.insertMany(postersData)
//         .then(() => {
//               console.log("Data inserted successfully!");
//         mongoose.connection.close();
//     })
//     .catch((err) => console.error(err));

//   app.get('/postersData', (req, res) => {
//     res.json(postersData);
//   });

start();
const dbUtils = require('./utils/dbUtils');
//dbUtils.fixSizeNames();

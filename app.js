const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const controllers = require('./controllers/generalControllers');
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
app.use(
  express.static(
    path.join(__dirname, 'public'),
    { extensions: ['html'] }
  )
);
app.use((req, res, next) => {
  if (req.path !== '/' && req.path.endsWith('/')) {
    // note: use 302 until you’re sure it works, then change to 301
    return res.redirect(302, req.path.slice(0, -1) + (req.url.slice(req.path.length) || ''));
  }
  next();
});
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

const port = process.env.PORT || 5000;

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

const postersData = require('./public/scripts/postersData');

// const { Poster, Product} = require('./models/Product');

// async function movePostersToProducts() {
//   try {
//     const posters = await Poster.find();
//     await Product.insertMany(posters);
//     await Poster.deleteMany(); // optional: remove from original
//     console.log('Posters moved to Products successfully.');
//   } catch (error) {
//     console.error('Error moving posters:', error);
//   }
// }
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

// const updateAllPosters = async () => {
//   try {
//     const result = await Poster.updateMany(
//       {}, // match all documents
//       {
//         $set: {
//           type: 'poster',
//         }
//       }
//     );
//     console.log(`${result.modifiedCount || result.nModified} posters updated.`);
//   } catch (err) {
//     console.error("Error updating posters:", err);
//   }
// };

// updateAllPosters();

start();
const dbUtils = require('./utils/dbUtils');
//dbUtils.migrate();
//dbUtils.fixSizeNames();

//movePostersToProducts();

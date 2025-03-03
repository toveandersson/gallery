const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const sendMail = require("./mailer"); // Import the mailer function
const axios = require('axios');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_URI);
//const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
// const lineItems = await stripe.checkout.sessions.listLineItems(
//   'cs_test_a1enSAC01IA3Ps2vL32mNoWKMCNmmfUGTeEeHXI5tLCvyFNGsdG2UNA7mr'
// );

const postersData = require('./public/scripts/postersData');
const Poster = require('./public/models/Poster')

app.use(express.static('./public'))
app.use(express.urlencoded({ extended: false }))
express.raw()
app.use(express.json())

const port = process.env.PORT || 1000;

const connectDB = (url) =>{
  return mongoose.connect(url)
}

const start = async () =>{
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`hello port ${port}...`)
    )
    console.log("Stripe URI:", process.env.STRIPE_URI ? "Loaded" : "Not Found");
    console.log("Webhook Secret:", process.env.STRIPE_WEBHOOK_SECRET ? "Loaded" : "Not Found");

  } catch (error) {
    console.log(error)
  }
}

const getAllPosters = async (req, res) => {
  try {
    const posters = await Poster.find().sort({ id: 1 }); // Sorts by _id in ascending order
    res.status(200).json(posters);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

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
  //   return Poster.find({id: fetchId})
  // }
  // INSERTION IN THE DATABASE!
  // Poster.insertMany(postersData)
  //     .then(() => {
    //         console.log("Data inserted successfully!");
    //         mongoose.connection.close();
    //     })
    //     .catch((err) => console.error(err));
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
      
      //   app.get('/posters/:posterID', async (req, res) => {
        //     try {
          //         const { posterID } = req.params;
          
          //         // Fetch poster from the database
          //         const singlePoster = await Poster.findOne({ id: posterID });
          
          //         if (singlePoster) {
            //             const queryString = new URLSearchParams(singlePoster.toObject()).toString();
            //             res.redirect(`/product/product.html?${queryString}`);
            //         } else {
              //             res.status(404).send('Poster not found');
              //         }
              //     } catch (error) {
                //         console.error("❌ Error fetching poster:", error);
                //         res.status(500).send("Internal Server Error");
                //     }
                // });
                
                
      //app.get('/create-checkout-session/:amount');
                
app.use(express.json()); // Middleware to parse JSON

app.post('/create-checkout-session', async (req, res) => {
  const { cartItems, amount_shipping, country, currency } = req.body;
  
  console.log('Received:', cartItems, amount_shipping, country, currency);

  try {
      // Map country to currency
      const countryCurrencyMap = {
        'SE': 'sek', 'FR': 'eur', 'DE': 'eur', 'IT': 'eur', 'ES': 'eur',
        'NL': 'eur', 'BE': 'eur', 'DK': 'dkk', 'FI': 'eur', 'NO': 'nok',
        'PL': 'pln', 'AT': 'eur', 'IE': 'eur', 'PT': 'eur', 'GR': 'eur',
        'LU': 'eur', 'CZ': 'czk', 'SK': 'eur', 'SI': 'eur',
        'LT': 'eur', 'LV': 'eur', 'EE': 'eur', 'BG': 'bgn', 'RO': 'ron',
        'HR': 'eur', 'CY': 'eur', 'MT': 'eur'
    };
    const selectedCurrency = currency;
      const deliveryEstimate = country === 'SE'
          ? { minimum: { unit: 'business_day', value: 2 }, maximum: { unit: 'business_day', value: 10 } }
          : { minimum: { unit: 'business_day', value: 5 }, maximum: { unit: 'business_day', value: 20 } };

      const countryToLocaleMap = {
      'SE': 'sv', 'DK': 'da', 'NO': 'nb', 'FI': 'fi', 'DE': 'de',
      'FR': 'fr', 'IT': 'it', 'ES': 'es', 'NL': 'nl', 'BE': 'nl',
      'AT': 'de', 'IE': 'en', 'PT': 'pt', 'GR': 'el', 'LU': 'fr',
      'CZ': 'cs', 'SK': 'sk', 'SI': 'sl', 'LT': 'lt',
      'LV': 'lv', 'EE': 'et', 'BG': 'bg', 'RO': 'ro', 'HR': 'hr',
      'PL': 'pl', 'MT': 'mt'
    };

    const currencyDecimals = {
      'EUR': 100, 'PLN': 100, 'BGN': 100, 'RON': 100, 'CZK': 100, // Convert to smallest unit
      'SEK': 100, 'DKK': 100, 'NOK': 100, // Already in whole numbers
  };
  
    const axiosResponse = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.AXIOS_KEY}/latest/SEK`);
    const exchangeRates = axiosResponse.data.conversion_rates;
    const sekToTarget = exchangeRates[selectedCurrency.toUpperCase()];

    const convertedShippingAmount = Math.round(amount_shipping * sekToTarget * (currencyDecimals[selectedCurrency.toUpperCase()])); // Convert and round
    console.log('converted: ', convertedShippingAmount);

    if (!exchangeRates[selectedCurrency.toUpperCase()]) {
      throw new Error(`Exchange rate for ${selectedCurrency} not found`);
  }

    const stripeLocale = countryToLocaleMap[country] || 'auto';
    
 
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
          shipping_address_collection: { allowed_countries: Object.keys(countryCurrencyMap)},
          locale: stripeLocale,
          automatic_tax: {
            enabled: false,
          },
          shipping_options: [
              {
                  shipping_rate_data: {
                      type: 'fixed_amount',
                      fixed_amount: {
                          amount: convertedShippingAmount, // Amount in smallest unit (e.g., cents)
                          currency: selectedCurrency // Stripe will handle conversion automatically
                      },
                      display_name: 'Standard shipping',
                      delivery_estimate: deliveryEstimate,
                  },
              },
          ],
          line_items: cartItems.map(item => ({
              price_data: {
                  currency: selectedCurrency,
                  product_data: { name: item.name },
                  unit_amount: Math.round(item.price * sekToTarget * (currencyDecimals[selectedCurrency.toUpperCase()])),  // Stripe expects amounts in the smallest unit (e.g., cents)
              },
              quantity: item.quantity,
          })),
          mode: 'payment',
          success_url: `${process.env.BASE_URL}/success`,
          cancel_url: `${process.env.BASE_URL}/cancel`,
      });

      res.json({ url: session.url });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating Stripe session' });
  }
});

// app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//   let event = request.body;
//   // Only verify the event if you have an endpoint secret defined.
//   // Otherwise use the basic event deserialized with JSON.parse
//   if (endpointSecret) {
//     // Get the signature sent by Stripe
//     const signature = request.headers['stripe-signature'];
//     try {
//       event = stripe.webhooks.constructEvent(
//         request.body,
//         signature,
//         endpointSecret
//       );
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message);
//       return response.sendStatus(400);
//     }
//   }

//   console.log(`Received event of type: ${event.type}`);

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//       console.log("Sending email for poster:");
//       //const lineItems = await stripe.checkout.sessions.listLineItems(paymentIntent.session.id);
//       console.log(lineItems);



//       sendMail(
//         process.env.MONGO_USER,
//         `Hello ${paymentIntent.name}!`,
//         `You have purchased: ${lineItems}`,
//         "Thank you :-)"
//       );
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send();
// });

start();
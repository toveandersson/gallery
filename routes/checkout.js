const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const sendMail = require("../mailer"); // Import the mailer function
const axios = require('axios');
require('dotenv').config();
const router = express.Router(); // Create a new Router instance

const STRIPE_KEY = process.env.STRIPE_URI;
if (!STRIPE_KEY) {
  console.error("Stripe API key is missing!");
}
const stripe = require('stripe')(STRIPE_KEY);


const countryCurrencyMap = {
  'SE': 'sek', 'FR': 'eur', 'DE': 'eur', 'IT': 'eur', 'ES': 'eur',
  'NL': 'eur', 'BE': 'eur', 'DK': 'dkk', 'FI': 'eur', 'NO': 'nok',
  'PL': 'pln', 'AT': 'eur', 'IE': 'eur', 'PT': 'eur', 'GR': 'eur',
  'LU': 'eur', 'CZ': 'czk', 'SK': 'eur', 'SI': 'eur',
  'LT': 'eur', 'LV': 'eur', 'EE': 'eur', 'BG': 'bgn', 'RO': 'ron',
  'HR': 'eur', 'CY': 'eur', 'MT': 'eur'
};

const countryToLocaleMap = {
  'SE': 'sv', 'DK': 'da', 'NO': 'nb', 'FI': 'fi', 'DE': 'de',
  'FR': 'fr', 'IT': 'it', 'ES': 'es', 'NL': 'nl', 'BE': 'nl',
  'AT': 'de', 'IE': 'en', 'PT': 'pt', 'GR': 'el', 'LU': 'fr',
  'CZ': 'cs', 'SK': 'sk', 'SI': 'sl', 'LT': 'lt',
  'LV': 'lv', 'EE': 'et', 'BG': 'bg', 'RO': 'ro', 'HR': 'hr',
  'PL': 'pl', 'MT': 'mt'
};

const currencyDecimals = 100;
// {
//   'EUR': 100, 'PLN': 100, 'BGN': 100, 'RON': 100, 'CZK': 100, // Convert to smallest unit
//   'SEK': 100, 'DKK': 100, 'NOK': 100, // Already in whole numbers
// };

async function helper(cartItems, amount_shipping, country, currency){
  const selectedCurrency = currency;
  //const sekToTarget = exchangeRates[selectedCurrency.toUpperCase()];
  const convertedAmount = Math.round(item.price * sekToTarget * (currencyDecimals[selectedCurrency.toUpperCase()]));
  console.log("converted amount ",convertedAmount);

  //const convertedShippingAmount = Math.round(amount_shipping * sekToTarget * (currencyDecimals[selectedCurrency.toUpperCase()])); // Convert and round
  //console.log('converted: ', convertedShippingAmount);
}

async function axiosConvert(amount_shipping, country){
  console.log("am sh ",amount_shipping);
  const axiosResponse = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.AXIOS_KEY}/latest/SEK`);
  const exchangeRates = axiosResponse.data.conversion_rates;
  //console.log("exh rates ",exchangeRates);
  const sekToTarget = exchangeRates[countryCurrencyMap[country].toUpperCase()];
  console.log("sektotarget ",sekToTarget);
  const convertedShippingAmount = Math.round(amount_shipping * sekToTarget * (currencyDecimals)); // Convert and round
  console.log("conv shi ",convertedShippingAmount);

  return { convertedShippingAmount, sekToTarget };
}

async function deliveryEstimation(country){
  const deliveryEstimate = country === 'SE'
    ? { minimum: { unit: 'business_day', value: 2 }, maximum: { unit: 'business_day', value: 10 } }
    : { minimum: { unit: 'business_day', value: 5 }, maximum: { unit: 'business_day', value: 20 } };
    return deliveryEstimate;
}



router.post('/create-checkout-session', async (req, res) => {
  const { cartItems, amount_shipping, country, currency } = req.body;
  console.log('Received:', cartItems, amount_shipping, country, currency);
  const { convertedShippingAmount, sekToTarget } = await axiosConvert(amount_shipping, country);
  const selectedCurrency = currency;
  const convertion = sekToTarget;
  const deliveryEstimate = await deliveryEstimation(country);
  const stripeLocale = countryToLocaleMap[country] || 'auto';
  console.log("shipping ",convertedShippingAmount);
  console.log("selectedCurrency ",selectedCurrency);
  console.log("",);
  console.log("",);
  try {
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
                          amount: convertedShippingAmount, // Amount in smallest unit (e.g., cents) convertedShippingAmount
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
                  product_data: { name: item.name, images: [process.env.BASE_URL+ encodeURI(item.images)]},
                  unit_amount: Math.round(item.price * convertion * currencyDecimals),  // Stripe expects amounts in the smallest unit (e.g., cents) Math.round(item.price * sekToTarget * (currencyDecimals[selectedCurrency.toUpperCase()]))
              },
              quantity: item.quantity,
              // metadata: {
              //   images: [process.env.BASE_URL+ item.images],
              // }
          })),
          mode: 'payment',
          metadata: { orderId: "12345XYZ" },  // ✅ Allowed
          success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,  
          cancel_url: `${process.env.BASE_URL}/order`,
      });

      res.json({ url: session.url });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating Stripe session' });
  }
});

router.get("/stripe/session/:sessionId", async (req, res) => {
  try {
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
      res.json({ customer_email: session.customer_details.email });
  } catch (error) {
      console.error("Error retrieving session:", error);
      res.status(500).json({ error: "Could not retrieve session" });
  }
});

module.exports = router;
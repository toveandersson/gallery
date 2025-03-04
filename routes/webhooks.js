const express = require('express');
const router = express.Router(); 
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const sendMail = require("../mailer"); // Import the mailer function
const axios = require('axios');
require('dotenv').config();

const STRIPE_KEY = process.env.STRIPE_URI;
if (!STRIPE_KEY) {
  console.error("Stripe API key is missing!");
}
const stripe = require('stripe')(STRIPE_KEY);

const endpointSecret = process.env.STRIPE_LIVE_WEBHOOK_SECRET;

router.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
    let event = request.body;
    if (endpointSecret) {
      const signature = request.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent( request.body, signature, endpointSecret );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        //console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        console.log("Sending email for poster:");
        //const lineItems = await stripe.checkout.sessions.listLineItems(paymentIntent.session.id);
        //console.log(lineItems);
        sendMail(
          process.env.MAIL_USER,
          `Hello ${paymentIntent.shipping.name}!`,
          `Total amount: ${paymentIntent.amount}`,
          //`You have purchased: ${lineItems}`,
          "Thank you :-)"
          //`${metadata.sessionId.line_items}`
        );
        sendMail(
          process.env.MAIL_USER,
          `User information about ${paymentIntent.shipping.name}!`,
          //`${JSON(paymentIntent.shipping.shipping_address_collection)}`
        );
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });

  module.exports = router;
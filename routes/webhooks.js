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

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  console.log('in webhook!');
  console.log('✅ Webhook request received:', request.headers);
  console.log('🔹 Raw body:', request.body.toString()); // Log raw body
    let event = request.body;
    
    if (endpointSecret) {
      const signature = request.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        try {
          const paymentIntent = event.data.object;
          const sessionId = paymentIntent.id; // This is the payment intent ID, not the checkout session ID

          console.log("Payment Intent ID:", sessionId);
          console.log("amount: ",paymentIntent.amount_received);
          sendMail(
            process.env.MAIL_USER,
            `User info about ${paymentIntent.shipping.name}!`,
            `Total amount: ${paymentIntent.amount}`,
          );
        
          response.json({ received: true });
        } catch (err) {
            console.error(`Intent error: ${err.message}`);
            response.status(400).send(`Intent error: ${err.message}`);
        }
      
        //console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        //console.log("Sending email for poster:");
        //const lineItems = await stripe.checkout.sessions.listLineItems(paymentIntent.session.id);
        //console.log(lineItems);
        // sendMail(
        //   process.env.MAIL_USER,
        //   `Hello ${paymentIntent.shipping.name}!`,
        //   `Total amount: ${paymentIntent.amount}`,
        //   //`You have purchased: ${lineItems}`,
        //   "Thank you :-)"
        //   //`${metadata.sessionId.line_items}`
        // );
        // sendMail(
        //   process.env.MAIL_USER,
        //   `User information about ${paymentIntent.shipping.name}!`,
        //   //`${JSON(paymentIntent.shipping.shipping_address_collection)}`
        // );

      break;
      case 'checkout_session.completed':
        try {
          const session = event.data.object;
              
              // Fetch line items using the session ID
              const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  
              console.log("Session ID:", session.id);
              console.log("Customer email:", session.customer_details.email);
              console.log("Shipping Info:", session.shipping);
              console.log("Purchased Items:", lineItems.data);

              sendMail(
              process.env.MAIL_USER, 
              `Hello ${session.shipping.name}!`,
              `Purchase: ${session.lineItems.data}`,
              //`You have purchased: ${lineItems}`,
              "Thank you :-)"
              //`${metadata.sessionId.line_items}`
            );
            sendMail(
              process.env.MAIL_USER,
              `More info about ${session.shipping.name}!`,
              `Shipping: ${session.shipping}`,
              `Address: ${session.shipping.address}`,
              `Postal code: ${session.shipping.address.postal_code}`,
              //`You have purchased: ${lineItems}`,
              "Thank you :-)"
              //`${metadata.sessionId.line_items}`
            );
              
              // Store order in your database here...
              response.json({ received: true });
        } catch (err) {
            console.error(`Webhook Error: ${err.message}`);
            response.status(400).send(`Webhook Error: ${err.message}`);
        }
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });

  module.exports = router;
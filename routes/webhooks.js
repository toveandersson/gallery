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
  console.log('in webhook!');
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
    
    // console.log(event);
    // console.log('id is this: ',event.id)
    // console.log('data is this: ',event.data)
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const sessionId = urlParams.get("session_id");
          console.log("Session ID:", sessionId);

          try {
            const session = await stripe.checkout.sessions.retrieve(sessionId, {
              expand: ['line_items']
            });
            sendMail(
                process.env.MAIL_USER,
                `Hello ${paymentIntent.shipping.name}!`,
                `Total amount: ${paymentIntent.amount}`,
                `You have purchased: ${session.line_items}`,
                "Thank you :-)"
                //`${metadata.sessionId.line_items}`
              );
  
            console.log("📦 Ordered Items:", session.line_items.data || "No items in the order.");
  
          } catch (error) {
              console.error("❌ Error retrieving line items:", error.message);
          }

        } catch (error) {
            console.error("❌ Error retrieving session id:", error.message);
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
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        // Retrieve Checkout Session to get line items

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
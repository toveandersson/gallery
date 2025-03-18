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
  //console.log('✅ Webhook request received:', request.headers);
  //console.log('🔹 Raw body:', request.body.toString()); // Log raw body
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
      break;
      case 'checkout.session.completed':
        try {
          const session = event.data.object;
              
              console.log("Session ID:", session.id);
              console.log("Customer email:", session.customer_details?.email);
              console.log("Shipping Info:", session.shipping_details?.address);
              console.log("Shipping postal code:", session.shipping_details.address.postal_code);
              //console.log("Purchased Items:", lineItems[0].data);
              // lineItems.forEach(item => {
                //   console.log("item metadata", item.metadata);
                // });
                
              const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id);
              const lineItems = lineItemsResponse.data; // ✅ Extract the data array
              
              console.log("Session ID type:", typeof session.id);

              sendMail(
              session.customer_details.email, 
              'Hello '+session.customer_details.name+',',
              'Your purchase id'+session.id,
              //`Purchase: ${JSON.stringify(lineItems, null, 2)}`

              `I will ship to this address:`,
              session.shipping_details?.address?.line1 || "No address provided! ",
              session.shipping_details?.address?.line2 || "",
              session.shipping_details?.address?.postal_code + "  " || "No postal code provided! "+ session.shipping_details?.address?.city || "No city provided!",
              session.shipping_details?.address?.country || "Unknown",
              //`You have purchased: ${lineItems}`,
              "If some of the information here looks wrong, just answer back to this email and give me the right information.",
              "Thank you :-)"
              //`${metadata.sessionId.line_items}`
            );
            sendMail(
              process.env.MAIL_USER,
              `New order from ${session.customer_details?.name || "Unknown Customer"}`,
              `Shipping Address: ${JSON.stringify(session.shipping_details?.address, null, 2)}`,
              `Purchased Items: ${JSON.stringify(lineItems, null, 2)}`,
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
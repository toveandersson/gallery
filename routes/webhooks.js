const express = require('express');
const router = express.Router(); 
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const sendMail = require("../mailer"); // Import the mailer function
const { fetchProductImages } = require('../app'); 
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

          // Fetch line items from Stripe
          const lineItemsResponse = await stripe.checkout.sessions.listLineItems(session.id);
          const lineItems = lineItemsResponse.data; // ✅ Extract the data array

          // Fetch images from MongoDB
          const purchasedItemsWithImages = await fetchProductImages(lineItems);

          console.log("Images with items:", purchasedItemsWithImages);

          // Format purchased items for text email
          const purchasedItemsText = purchasedItemsWithImages
            .map(item => `- ${item.name}`)
            .join("\n");

          // Format purchased items for HTML email
          const purchasedItemsHTML = purchasedItemsWithImages
            .map(item => `<p><strong>${item.name}</strong><br><img src="${item.image}" alt="${item.name}" width="200"></p>`)
            .join("");

          // ✅ Combine email messages into one function call
          const customerEmailText = [
            `Hello ${session.customer_details.name}!`,
            `Your purchase ID: ${session.id}`,
            "",
            "I will ship to this address:",
            session.shipping_details.address.line1,
            session.shipping_details.address.postal_code + " " + session.shipping_details.address.city,
            session.shipping_details.address.country,
            "",
            "Purchased items:",
            purchasedItemsText,
            "",
            "Please send me an email if anything above looks wrong!",
            "Your package should arrive in 2-10 business days.",
            "Thank you :-)"
          ].join("\n");

          const customerEmailHTML = `
            <h2>Your Purchase</h2>
            <p>Your purchase ID: <strong>${session.id}</strong></p>
            ${purchasedItemsHTML}
            <h2>Shipping Address:</h2>
            <p>
              ${session.shipping_details.address.line1}<br>
              ${session.shipping_details.address.postal_code} ${session.shipping_details.address.city}<br>
              ${session.shipping_details.address.country}
            </p>
            <p>If some of the information here looks wrong, just reply to this email.</p>
            <p>Your package should arrive in <strong>2-10 business days</strong>.</p>
            <p>Thank you! 😊</p>
          `;

          // ✅ Send email to the customer
          sendMail(
            session.customer_details.email,
            "Order Confirmation",
            customerEmailText,  // Plain text fallback
            customerEmailHTML   // HTML version
          );

          // ✅ Send notification email to admin
          const adminMessage = [
            `New order from ${session.customer_details?.name || "Unknown Customer"}`,
            "",
            `Shipping Address:\n${JSON.stringify(session.shipping_details.address, null, 2)}`,
            "",
            `Purchased Items:\n ${JSON.stringify(lineItems, null, 2)}, `,
            "",
            "Thank you :-)"
          ].join("\n");

          sendMail(process.env.MAIL_USER, "New Order Notification", adminMessage);

          // ✅ Send response back to Stripe
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
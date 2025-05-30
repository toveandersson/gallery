const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure dotenv is properly loaded

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_SENDER_ADRESS,
    pass: process.env.MAIL_SENDER_PASSWORD // Ensure you are using an App Password
  },
  tls: {
    rejectUnauthorized: false // Bypass self-signed certificate error
  } 
});

const sendMail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.MAIL_SENDER_ADRESS,
    to: to,
    subject: subject,
    text: text,  // Fallback plain text
    html: html   // HTML version for email clients that support it
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully TO", to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendMail;

const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure dotenv is properly loaded

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD // Ensure you are using an App Password
  },
  tls: {
    rejectUnauthorized: false // Bypass self-signed certificate error
  }
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: to,
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendMail;

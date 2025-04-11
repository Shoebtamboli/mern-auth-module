const nodemailer = require('nodemailer');

/**
 * Send email using Nodemailer
 * @param {Object} options - Email options (to, subject, text, html)
 * @returns {Promise} - Result of sending email
 */
const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // Secure if port is 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define mail options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // Send the email
  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = {
  sendEmail,
};
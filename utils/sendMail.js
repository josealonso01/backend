const { createTransport } = require("nodemailer");
const { logger } = require("../public/logger");

const sendMail = async (email, subject, content) => {
  const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `e-commerce <${process.env.GMAIL_ACCOUNT}>`,
    to: email,
    subject: subject,
    html: content,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
  } catch (e) {
  logger.error(e)
  }
};

module.exports = sendMail;
const twilio = require('twilio');

const ACCOUNT_SID = 'AC6ec33532229012091d9f7bfb804c04cb';
const AUTH_TOKEN = '62898f1da5b46f98cd047e7b2355d79c';
const PHONE_NUMBER = 'whatsapp:+5492494374440';

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

const sendWhatsapp = async (body) => {
  try {
    const message = await client.messages.create({
      body,
      from: PHONE_NUMBER,
      to: 'whatsapp:+5492494374440',
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = sendWhatsapp;

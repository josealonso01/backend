module.exports = {
  apps: [
    {
      name: 'app1',
      script: 'server.js',
      watch: true,
      autorestart: true,
      // instances: 4,
      args: '--puerto=8080',
    },
    {
      name: 'app2',
      script: 'server.js',
      watch: true,
      autorestart: true,
      instances: 'max',
      args: '--puerto=8081',
    },
    {
      script: './service-worker/',
      watch: ['./service-worker'],
    },
  ],
};

const mongoose = require('mongoose');

const connectMDB = async () => {
  try {
    const URL = process.env.URL;
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUniFiedTopology: true,
    });
  } catch (error) {
    logger.error(error);
  }
};

const disconnectMDB = () => {
  mongoose.disconnect();
};

module.exports = {
  connectMDB,
  disconnectMDB,
};

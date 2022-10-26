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

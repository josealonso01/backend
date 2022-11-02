const winston = require('winston');

const logConfig = {
  level: 'info',
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({
      filename: './logs/warn.log',
      level: 'warn',
    }),
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
    }),
  ],
};

const logger = winston.createLogger(logConfig);

module.exports = {logger};

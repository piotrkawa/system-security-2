const winston = require('winston');

const LOGGER = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { level: 'info' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
      new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
      }),
    ]
  });

module.exports = { LOGGER }
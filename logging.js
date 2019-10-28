const winston = require('winston');

class TimestampFirst {
    transform(obj) {
        return Object.assign({
            timestamp: obj.timestamp
        }, obj);
    }
}

const timeStampFirstFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    new TimestampFirst(true),
    winston.format.json()
);

const LOGGER = winston.createLogger({
    level: 'info',
    format: timeStampFirstFormat,
    defaultMeta: { level: 'info' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
      new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
      }),
    ]
  });

module.exports = { LOGGER }
import winston from 'winston';
winston.emitErrs = false;

const logLevel = (process.env.NODE_ENV === 'production') ? 'info' : 'debug';

const loggerTransports = [
  new winston.transports.File({
    level: logLevel,
    filename: './log/discovery-ui.log',
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    json: false,
    formatter: (options) => {
      const outputObject = {
        level: options.level.toUpperCase(),
        message: options.message,
        timestamp: new Date().toISOString(),
      };

      return JSON.stringify(Object.assign(outputObject, options.meta));
    },
  }),
];

// spewing logs while running tests is annoying
if (process.env.NODE_ENV !== 'test') {
  loggerTransports.push(new winston.transports.Console({
    level: logLevel,
    handleExceptions: true,
    json: true,
    stringify: true,
    colorize: true,
  }));
}

const logger = new winston.Logger({
  transports: loggerTransports,
  exitOnError: false,
});

export default logger;

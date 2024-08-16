import pino from 'pino';

const logger = pino({
    level: 'debug',  // Change the log level to 'debug'
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    }
});

export default logger;

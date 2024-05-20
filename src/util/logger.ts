import pino from 'pino';

export default pino({
  enabled: true,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    }
  },
  level: 'info'
});
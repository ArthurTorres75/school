import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import winston, { format, transports } from 'winston';

export const winstonLogger = () => {
  const instance = [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new transports.File({ filename: 'combined.log' }),
  ];

  const logger = WinstonModule.createLogger({
    transports: instance,
  });

  return logger;
};

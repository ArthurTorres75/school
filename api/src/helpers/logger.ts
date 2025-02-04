import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { format, transports } from 'winston';

const logger = WinstonModule.createLogger({
  transports: [
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
  ],
});

export default logger;

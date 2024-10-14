import { Injectable } from '@nestjs/common';
import { logger } from './winston.logger';

@Injectable()
export class LoggerService {

  error(error: Error, context?: string) {
    logger.error(error.message, { context });
  }

  warn(error: Error, context?: string) {
    logger.warn(error.message, { context });
  }

  info(error: Error, context?: string) {
    logger.info(error.message, { context });
  }
}



// import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
// import * as winston from 'winston';
// import 'winston-mongodb';

// @Injectable()
// export class LoggerService implements NestLoggerService {
//   private readonly logger: winston.Logger;

//   constructor() {
//     this.logger = winston.createLogger({
//       level: 'info',
//       transports: [
//         new winston.transports.Console({
//           format: winston.format.simple(),
//           level: 'error',
//         }),
//       ],
//     });
//     this.initMongoDBTransport();
//   }

//   private initMongoDBTransport() {
//     try {
//       const transportOptions = {
//         db: process.env.MONGO_URI,           
//         collection: process.env.MONGO_COLLECTION,
//         level: 'info',
//       };

//       this.logger.add(new winston.transports.MongoDB(transportOptions));
//     } catch (error) {
//       this.logger.error('Failed to initialize MongoDB logging', error);
//     }
//   }

//   log(message: string) {
//     this.logger.info(message);
//   }

//   error(message: string, trace: string) {
//     this.logger.error(message, { trace });
//   }

//   warn(message: string) {
//     this.logger.warn(message);
//   }
// }

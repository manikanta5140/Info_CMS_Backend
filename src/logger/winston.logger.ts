import * as winston from 'winston';
import * as path from 'path';
import 'winston-daily-rotate-file';

const jsonFormat = winston.format.printf(
  ({ timestamp, level, message, context }) => {
    return `${JSON.stringify({
      timestamp,
      level,
      message,
      context,
    })},`;
  },
);

const logDir = process.env.LOG_DIR || 'C:/log';

const transports = [
  new winston.transports.DailyRotateFile({
    level: 'error',
    filename: 'error-%DATE%.log',
    dirname: logDir,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(winston.format.timestamp(), jsonFormat),
  }),
  // new winston.transports.DailyRotateFile({
  //   level: 'warn',
  //  filename: 'warn-%DATE%.log',
  //  dirname: logDir,
  //   datePattern: 'YYYY-MM-DD',
  //   zippedArchive: true,
  //   maxSize: '20m',
  //   maxFiles: '14d',
  //   format: winston.format.combine(winston.format.timestamp(), jsonFormat),
  // }),
//   new winston.transports.DailyRotateFile({
//     level: 'info',
//    filename: 'info-%DATE%.log',
//    dirname: logDir,
//     datePattern: 'YYYY-MM-DD',
//     zippedArchive: true,
//     maxSize: '20m',
//     maxFiles: '14d',
//     format: winston.format.combine(winston.format.timestamp(), jsonFormat),
//   })
];

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports,
});

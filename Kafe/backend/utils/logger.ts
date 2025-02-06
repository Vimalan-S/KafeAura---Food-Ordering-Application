import { createLogger, format, transports } from 'winston';
import * as path from 'path';

const logFilePath = path.join(__dirname, '../../logs/app.log'); // Adjust path as needed

const logger = createLogger({
  level: 'info', // Log level (e.g., 'info', 'error', 'debug', etc.)
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    // Write logs to a file
    new transports.File({ filename: logFilePath }),
    
    // Optionally log to console
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message }) => `[${level.toUpperCase()}]: ${message}`)
      )
    })
  ]
});

export default logger;

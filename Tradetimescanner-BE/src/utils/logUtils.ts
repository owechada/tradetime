import fs from 'fs';
import path from 'path';
import util from 'util';

// Define the log file path in the root directory
const logFilePath = path.join(process.cwd(), 'app.log');
const logFile = fs.createWriteStream(logFilePath, { flags: 'a' }); // 'a' flag for appending

/**
 * Custom logging function to capture all console output to file and stdout.
 */
export function setupLogging(): void {
  const logToFile = (message: string): void => {
    logFile.write(message + '\n');
    process.stdout.write(message + '\n');
  };

  const logToErrorFile = (message: string): void => {
    logFile.write(message + '\n');
    process.stderr.write(message + '\n');
  };

  // Override console.log, console.error, and console.warn to log to file
  console.log = function (...args: unknown[]): void {
    const message = util.format(...args);
    logToFile(message);
  };

  console.error = function (...args: unknown[]): void {
    const message = util.format(...args);
    logToErrorFile(message);
  };

  console.warn = function (...args: unknown[]): void {
    const message = util.format(...args);
    logToFile(message);
  };

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: unknown) => {
    logToErrorFile(`Unhandled Rejection: ${util.format(reason)}`);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    logToErrorFile(`Uncaught Exception: ${error.stack || error}`);
  });
}

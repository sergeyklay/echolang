const log = (level: string, message: string, ...args: unknown[]) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  if (args.length > 0) {
    console.log(logMessage, ...args);
  } else {
    console.log(logMessage);
  }
};

export const logger = {
  info: (message: string, ...args: unknown[]) => log('info', message, ...args),
  error: (message: string, ...args: unknown[]) => log('error', message, ...args),
  warn: (message: string, ...args: unknown[]) => log('warn', message, ...args),
  debug: (message: string, ...args: unknown[]) => log('debug', message, ...args),
};


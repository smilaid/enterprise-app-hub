export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export enum LogCategory {
  AUTH = 'AUTH',
  API = 'API',
  UI = 'UI',
  NAVIGATION = 'NAVIGATION',
  USER_ACTION = 'USER_ACTION',
  SYSTEM = 'SYSTEM',
}

interface LogEntry {
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
  timestamp: string;
  userId?: string;
}

class Logger {
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private createLogEntry(level: LogLevel, category: LogCategory, message: string, data?: any, userId?: string): LogEntry {
    return {
      level,
      category,
      message,
      data,
      timestamp: new Date().toISOString(),
      userId,
    };
  }

  private log(level: LogLevel, category: LogCategory, message: string, data?: any, userId?: string) {
    if (!this.shouldLog(level)) return;

    const logEntry = this.createLogEntry(level, category, message, data, userId);
    this.logs.push(logEntry);

    // Keep only the last N logs to prevent memory issues
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with appropriate method
    const prefix = `[${logEntry.timestamp}] [${LogCategory[category]}]`;
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, data);
        break;
      case LogLevel.INFO:
        console.info(prefix, message, data);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, data);
        break;
      case LogLevel.ERROR:
        console.error(prefix, message, data);
        break;
    }
  }

  debug(category: LogCategory, message: string, data?: any, userId?: string) {
    this.log(LogLevel.DEBUG, category, message, data, userId);
  }

  info(category: LogCategory, message: string, data?: any, userId?: string) {
    this.log(LogLevel.INFO, category, message, data, userId);
  }

  warn(category: LogCategory, message: string, data?: any, userId?: string) {
    this.log(LogLevel.WARN, category, message, data, userId);
  }

  error(category: LogCategory, message: string, data?: any, userId?: string) {
    this.log(LogLevel.ERROR, category, message, data, userId);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  // Export logs for debugging or monitoring
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Single logger instance
export const logger = new Logger();

// Set log level based on environment
if (import.meta.env.DEV) {
  logger.setLogLevel(LogLevel.DEBUG);
} else {
  logger.setLogLevel(LogLevel.INFO);
}

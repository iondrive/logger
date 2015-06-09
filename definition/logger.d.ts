declare module '@iondrive/logger' {
  interface Logger {
    trace(err: Error, message: string, ...args: any[]): void;
    trace(err: Error, ...args: any[]): void;
    trace(message: string, ...args: any[]): void;
    trace(...args: any[]): void;

    debug(err: Error, message: string, ...args: any[]): void;
    debug(err: Error, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    debug(...args: any[]): void;

    info(err: Error, message: string, ...args: any[]): void;
    info(err: Error, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    info(...args: any[]): void;

    warn(err: Error, message: string, ...args: any[]): void;
    warn(err: Error, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    warn(...args: any[]): void;

    error(err: Error, message: string, ...args: any[]): void;
    error(err: Error, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    error(...args: any[]): void;

    fatal(err: Error, message: string, ...args: any[]): void;
    fatal(err: Error, ...args: any[]): void;
    fatal(message: string, ...args: any[]): void;
    fatal(...args: any[]): void;
  }

  var logger: Logger;
  export = logger;
}

import util = require('util');
import os = require('os');

const stringify: (data: any) => string = require('safe-json-stringify');

const LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

var minLevel: string = process.env.NODE_LOG_LEVEL || process.env.LOG_LEVEL || 'info';
var minLevelIndex = LEVELS.indexOf(minLevel);

if (minLevelIndex === -1) {
  throw Error(util.format('Logging level "%s" is not supported.', minLevel));
}

interface ExtendedError extends Error {
  stack?: string,
  cause?: () => ExtendedError,
  code?: string
}

interface LogRecord {
  level: string,
  time: Date,
  hostname: string,
  pid: number,
  msg: string,
  err?: Error
}

function getErrorStack(err: ExtendedError) {
  var stack: string = err.stack || err.toString();
  if (typeof err.cause === 'function') {
    var cause = err.cause();
    if (cause) {
      stack += '\nCaused by: ' + getErrorStack(cause);
    }
  }
  return stack;
}

function serializeError(err: ExtendedError) {
  return {
    message: err.message,
    name: err.name,
    stack: getErrorStack(err),
    code: err.code
  };
}

var makeLogFunction = (level: string) => {
  var levelIndex = LEVELS.indexOf(level);
  if (levelIndex < minLevelIndex) return () => {};

  return function (...args: any[]) {
    var record = <LogRecord>{
      level: level,
      time: new Date(),
      hostname: os.hostname(),
      pid: process.pid
    };

    if (args[0] instanceof Error) {
      record.err = serializeError(args[0]);
      record.msg = record.err.message;
      args = args.slice(1);
    }

    if (args.length > 0) {
      record.msg = util.format.apply(null, args);
    }

    process.stdout.write(stringify(record) + '\n');
  };
};

var logger = {
  trace: makeLogFunction('trace'),
  debug: makeLogFunction('debug'),
  info: makeLogFunction('info'),
  warn: makeLogFunction('warn'),
  error: makeLogFunction('error'),
  fatal: makeLogFunction('fatal')
};
Object.freeze(logger);

export = logger;

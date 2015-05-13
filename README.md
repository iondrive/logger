# @iondrive/logger

A [12-factor](http://12factor.net/logs) logging module for Node.js/io.js.

[![Build Status][travis-image]][travis-url]

## Principles

  * Log to `stdout`. The environment should manage how logs are routed and stored.
  * Log as JSON, allowing machines to read the log output.  

## Install

```bash
npm install @iondrive/logger
```

## Usage

### Logging level

The logging level can be set with the environment variable `NODE_LOG_LEVEL` or `LOG_LEVEL`. The value can be one of `trace`, `debug`, `info`, `warn`, `error` or `fatal`. The default level is `info`.

### Example

```js
var log = require('@iondrive/logger');

log.info('hello');

// The following will log the error fields and stack trace
log.info(err);
log.info(err, 'Something broke');
```

### Formatting

All logger methods use `util.format` and thus can use placeholder formatting.

```js
log.debug('hello from %s', 'iondrive'); // 'hello from iondrive'
```

## License

[MIT](LICENSE)

[travis-image]: https://img.shields.io/travis/iondrive/logger.svg
[travis-url]: https://travis-ci.org/iondrive/logger

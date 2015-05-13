const log = require('../../');

var err = Error('An error occurred');
err.cause = function () {
  return Error('Cause');
};
err.code = 'ECAUSE';

log.info(err);

var assert = require('assert');
var path = require('path');
var os = require('os');

var exec = require('child_process').exec;

// Assert that two dates are within 100ms of each other
function assertDateSimilar(a, b) {
  var difference = Math.abs(a.getTime() - b.getTime());
  assert(difference < 100);
}

describe('logger', function () {
  var records, first, pid;

  function execFixture(name, env) {
    return function (done) {
      var child = exec('node ' + path.resolve(__dirname, './fixtures/' + name + '.js'), { env: env }, function (err, stdout) {
        records = stdout.toString().trim().split('\n').map(JSON.parse);
        first = records[0];
        done();
      });
      pid = child.pid;
    };
  }

  describe('record', function () {
    beforeEach(execFixture('message'));

    it('should include level', function () {
      assert.equal(first.level, 'info');
    });

    it('should include time', function () {
      assertDateSimilar(new Date(first.time), new Date());
    });

    it('should include hostname', function () {
      assert.equal(first.hostname, os.hostname());
    });

    it('should include pid', function () {
      assert.equal(first.pid, pid);
    });
  });

  describe('message', function () {
    beforeEach(execFixture('message'));

    it('should output message', function () {
      assert.equal(first.msg, 'hello');
    });
  });

  describe('levels', function () {
    it('should respect log level', function (done) {
      execFixture('levels')(function () {
        assert.equal(records[0].level, 'info');
        assert.equal(records[0].msg, 'info');
        assert.equal(records[1].level, 'warn');
        assert.equal(records[1].msg, 'warn');
        assert.equal(records[2].level, 'error');
        assert.equal(records[2].msg, 'error');
        assert.equal(records[3].level, 'fatal');
        assert.equal(records[3].msg, 'fatal');
        done();
      })
    });

    it('should respect log level', function (done) {
      execFixture('levels', { LOG_LEVEL: 'trace' })(function () {
        assert.equal(records[0].level, 'trace');
        assert.equal(records[0].msg, 'trace');
        assert.equal(records[1].level, 'debug');
        assert.equal(records[1].msg, 'debug');
        assert.equal(records[2].level, 'info');
        assert.equal(records[2].msg, 'info');
        assert.equal(records[3].level, 'warn');
        assert.equal(records[3].msg, 'warn');
        assert.equal(records[4].level, 'error');
        assert.equal(records[4].msg, 'error');
        assert.equal(records[5].level, 'fatal');
        assert.equal(records[5].msg, 'fatal');
        done();
      })
    });
  });

  describe('format', function () {
    beforeEach(execFixture('format'));

    it('should format message', function () {
      assert.equal(first.msg, 'hi 123 {"foo":"bar"}');
    });
  });

  describe('error', function () {
    beforeEach(execFixture('error'));

    it('should include error', function () {
      assert.equal(first.msg, 'An error occurred');
      assert.equal(first.err.message, 'An error occurred');
      assert.equal(first.err.name, 'Error');
      assert(first.err.stack.indexOf('Error: An error occurred') > -1);
    });
  });

  describe('errorFields', function () {
    beforeEach(execFixture('errorFields'));

    it('should include extra fields', function () {
      assert.equal(first.err.code, 'ECAUSE');
      assert(first.err.stack.indexOf('Caused by: Error: Cause') > -1);
    });
  });

  describe('errorFormat', function () {
    beforeEach(execFixture('errorFormat'));

    it('should allow formatting', function () {
      assert.equal(first.msg, 'hi there');
    });
  });
});


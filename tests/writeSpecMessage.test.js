/* global describe, it, beforeEach */
'use strict';

require('colors');

var assert = require('assert');
var ReporterDriver = require('./ReporterDriver');

describe('writeSpecMessage', function () {

  var output, driver;

  beforeEach(function () {
    output = '';
    driver = new ReporterDriver(function (msg) {
      output += msg;
    });
  });

  describe('when success suppressed', function () {
    beforeEach(function () {
      driver.when
            .successSuppressed()
            .init();
    });

    it('should format simple error', function () {
      driver.on.specFailure('phantom', ['describe'], 'it', ['expect']);

      assert.equal(output, '\n' + 'DESCRIBE => describe'.yellow +
        '\n  IT => it\n' +
        '    ' + '✗ '.red + 'expect'.red);
    });

    it('should format multiple expect error', function () {
      driver.on.specFailure('phantom', ['describe'], 'it', ['expect1', 'expect2']);

      assert.equal(output, '\n' + 'DESCRIBE => describe'.yellow +
        '\n  IT => it\n' +
        '    ' + '✗ '.red + 'expect1'.red +
        '    ' + '✗ '.red + 'expect2'.red);
    });

    it('should format simple error in nested suite', function () {
      driver.on.specFailure('phantom', ['describe', 'inner describe'], 'it', ['expect']);

      assert.equal(output, '\n' + 'DESCRIBE => describe'.yellow +
        '\n  ' + 'DESCRIBE => inner describe'.yellow +
        '\n    IT => it\n' +
        '      ' + '✗ '.red + 'expect'.red);
    });

    it('should merge errors under same suite', function () {
      driver.on
            .specFailure('phantom', ['describe'], 'it', ['expect1'])
            .specFailure('phantom', ['describe'], 'it2', ['expect2']);

      assert.equal(output, '\n' + 'DESCRIBE => describe'.yellow +
        '\n  IT => it\n' +
        '    ' + '✗ '.red + 'expect1'.red +
        '\n  IT => it2\n' +
        '    ' + '✗ '.red + 'expect2'.red);
    });

    it('should hide success specs', function () {
      driver.on
            .specFailure('phantom', ['describe'], 'it', ['expect1'])
            .specSuccess('phantom', ['describe'], 'it2', ['expect2']);

      assert.equal(output, '\n' + 'DESCRIBE => describe'.yellow +
        '\n  IT => it\n' +
        '    ' + '✗ '.red + 'expect1'.red);
    });

    it('should print skipped spec', function () {
      driver.on
            .specSkipped('phantom', ['describe'], 'it2', [])
            .specFailure('phantom', ['describe'], 'it', ['expect1']);

      assert.equal(output, '\n' + 'DESCRIBE => describe'.yellow +
        '\n  ' + 'IT => it2'.cyan + '\n' +
        '\n  IT => it\n' +
        '    ' + '✗ '.red + 'expect1'.red);
    });

    it('should not fail if suite name has reserved keywords', function () {
      driver.on
            .specFailure('phantom', ['constructor'], 'd1', ['l1'])
            .specFailure('phantom', ['toString'], 'd2', ['l1']);

      assert.equal(output,
        '\n' + 'DESCRIBE => constructor'.yellow +
        '\n  IT => d1\n' +
        '    ' + '✗ '.red + 'l1'.red +
        '\n' + 'DESCRIBE => toString'.yellow +
        '\n  IT => d2\n' +
        '    ' + '✗ '.red + 'l1'.red);
    });
  });
  describe('when success', function () {
    beforeEach(function () {
      driver.when.init();
    });

    it('should format simple success', function () {
      driver.on.specSuccess('phantom', ['describe'], 'it2', ['expect2']);

      assert.equal(output, '\n' + 'DESCRIBE => describe'.yellow +
        '\n  IT => it2\n' +
        '    ' + '✓ '.green + 'expect2'.green);
    });

    it('should format success with error', function () {
      driver.on
            .specSuccess('phantom', ['describe'], 'it2', ['expect2'])
            .specFailure('phantom', ['describe'], 'it', ['expect1']);

      assert.equal(output, '\n' + 'DESCRIBE => describe'.yellow +
        '\n  IT => it2\n' +
        '    ' + '✓ '.green + 'expect2'.green +
        '\n  IT => it\n' +
        '    ' + '✗ '.red + 'expect1'.red);
    });

    it('should merge success under same suite', function () {
      driver.on
            .specSuccess('phantom', ['describe'], 'it', ['expect1'])
            .specSuccess('phantom', ['describe'], 'it2', ['expect2']);

      assert.equal(output, '\n' + 'DESCRIBE => describe'.yellow +
        '\n  IT => it\n' +
        '    ' + '✓ '.green + 'expect1'.green +
        '\n  IT => it2\n' +
        '    ' + '✓ '.green + 'expect2'.green);
    });
  });
});

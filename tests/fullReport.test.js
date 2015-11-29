/* global describe, it, beforeEach */
'use strict';

require('colors');

var assert = require('assert');
var ReporterDriver = require('./ReporterDriver');

describe('Full report', function () {

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
            .init();
    });


    it('should print full report', function () {
      driver.on
            .browserLog('error', 'error')
            .browserLog('warn', 'warn')
            .browserLog('log', 'log')
            .specSkipped('phantom', ['describe'], 'it2', [])
            .specFailure('phantom', ['describe'], 'it', ['expect1'])
            .specSuccess('phantom', ['describe'], 'it2', ['expect2'])
            .runComplete(['phantom'], {failed: 1, success: 1});

      assert.equal(output, '\n' + 'DESCRIBE => describe'.yellow +
        '\n  ' + 'IT => it2'.cyan + '\n' +
        '\n  IT => it\n' +
        '    ' + '✗ '.red + 'expect1'.red +
        '\n  IT => it2\n' +
        '    ' + '✓ '.green + 'expect2'.green +
        '\nConsole logs:\n'.cyan.underline +
        '  error: ' + 'error'.red + '\n' +
        '  warn:  ' + 'warn'.yellow + '\n' +
        '  log:   ' + 'log'.blue + '\n' +
        '\nphantom' +
        '\nTOTAL: ' + '1 FAILED'.red + ', ' + '1 SUCCESS'.green +
        '\n\n' +
        '\n' + 'DESCRIBE => describe\n'.yellow +
        '     IT => it\n' +
        '          ERROR => undefinedexpect1'.red +
        '\n\n');
    });
  });
});

/* global describe, it, beforeEach */
'use strict';

require('colors');

var assert = require('assert');
var ReporterDriver = require('./ReporterDriver');

describe('onRunComplete', function () {
  var output, driver;

  beforeEach(function () {
    output = '';
    driver = new ReporterDriver(function (msg) {
      output += msg;
    });
  });

  beforeEach(function () {
    driver.when
          .suppressErrorSummary()
          .init();
  });

  it('should output nothing if no browsers', function () {
    driver.on
          .runComplete([], {failed: 1, success: 0});

    assert.equal(output, '\n');
  });

  it('should output nothing if disconnected', function () {
    driver.on
          .runComplete(['phantom'], {failed: 1, success: 0, disconnected: true});

    assert.equal(output, '\n');
  });


  it('should output nothing if error', function () {
    driver.on
          .runComplete(['phantom'], {failed: 1, success: 0, error: true});

    assert.equal(output, '\n');
  });

  it('should print all the browsers', function () {
    driver.on
          .runComplete(['phantom', 'chrome'], {failed: 1, success: 0});

    assert.equal(output, '\nphantom' +
      '\nchrome' +
      '\nTOTAL: ' + '1 FAILED'.red + ', ' + '0 SUCCESS'.green +
      '\n\n');
  });

  it('should print totals', function () {
    driver.on
          .runComplete(['phantom'], {failed: 1, success: 0});

    assert.equal(output, '\nphantom' +
      '\nTOTAL: ' + '1 FAILED'.red + ', ' + '0 SUCCESS'.green +
      '\n\n');
  });

  it('should print only success totals', function () {
    driver.on
          .runComplete(['phantom'], {failed: 0, success: 1});

    assert.equal(output, '\nphantom\n' +
      'TOTAL: 1 SUCCESS'.green +
      '\n\n');
  });

  it('should print console logs', function () {
    driver.on
          .browserLog('error', 'error')
          .browserLog('warn', 'warn')
          .browserLog('log', 'log')
          .runComplete(['phantom'], {failed: 0, success: 1});

    assert.equal(output, '\nConsole logs:\n'.cyan.underline +
      '  error: ' + 'error'.red + '\n' +
      '  warn:  ' + 'warn'.yellow + '\n' +
      '  log:   ' + 'log'.blue + '\n' +
      '\nphantom\n' +
      'TOTAL: 1 SUCCESS'.green +
      '\n\n');
  });
});

/* global describe, it, beforeEach */
'use strict';

require('colors');

var assert = require('assert');
var util = require('util');
var SimpleReporter = require('./index')['reporter:karmaSimpleReporter'].pop();

describe('Simple Reporter', function () {
  var output, reporter;

  beforeEach(function () {
    output = '';
    reporter = new SimpleReporter(function (self) {
      self.write = function () {
        output += util.format.apply(this, arguments);
      };
    });
  });

  it('should format simple error', function () {
    reporter.onSpecComplete('phantom', {suite: ['a'], description: 'b', log: 'c', success: false});
    reporter.onRunComplete(['phantom'], {failed: 1, success: 0});
    assert.equal(output, '\n' + 'TOTAL: 1 FAILED'.red + ', ' + '0 SUCCESS'.green + '\n\n' +
                 '1) \n'.grey +
                 'DESCRIBE => a\n'.yellow +
                 'IT => b\n'.cyan +
                 'ERROR => c\n'.red +
                 '\n\n\n');
  });

  it('should format simple error in nested suite', function () {
    reporter.onSpecComplete('phantom', {suite: ['a', 'x'], description: 'b', log: 'c', success: false});
    reporter.onRunComplete(['phantom'], {failed: 1, success: 0});
    assert.equal(output, '\n' + 'TOTAL: 1 FAILED'.red + ', ' + '0 SUCCESS'.green + '\n\n' +
                 '1) \n'.grey +
                 'DESCRIBE => a,x\n'.yellow +
                 'IT => b\n'.cyan +
                 'ERROR => c\n'.red +
                 '\n\n\n');
  });

  it('should format simple success', function () {
    reporter.onSpecComplete('phantom', {suite: ['a'], description: 'b', log: 'c', success: true});
    reporter.onRunComplete(['phantom'], {failed: 0, success: 1});
    assert.equal(output, '\n' + 'TOTAL: 1 SUCCESS'.green + '\n');
  });

  it('should output nothing if no browsers', function () {
    reporter.onSpecComplete('phantom', {suite: ['a'], description: 'b', log: 'c', success: false});
    reporter.onRunComplete([], {failed: 1, success: 0});
    assert.equal(output, '\n');
  });

  it('should output nothing if disconnected', function () {
    reporter.onSpecComplete('phantom', {suite: ['a'], description: 'b', log: 'c', success: false});
    reporter.onRunComplete(['phantom'], {failed: 1, success: 0, disconnected: true});
    assert.equal(output, '\n');
  });

  it('should output nothing if error', function () {
    reporter.onSpecComplete('phantom', {suite: ['a'], description: 'b', log: 'c', success: false});
    reporter.onRunComplete(['phantom'], {failed: 1, success: 0, error: true});
    assert.equal(output, '\n');
  });

});

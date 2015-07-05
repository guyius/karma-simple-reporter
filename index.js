'use strict';

var SpecReporter = function (baseReporterDecorator) {
  baseReporterDecorator(this);

  require('colors');

  var failures = {tests: [], suites: {}};
  var TOTAL_SUCCESS = '\n' + 'TOTAL: %d SUCCESS'.green;
  var TOTAL_FAILED = '\n' + 'TOTAL: %d FAILED'.red + ', ' +  '%d SUCCESS'.green;

  this.onRunComplete = function (browsers, results) {
    if (browsers.length >= 1 && !results.disconnected && !results.error) {
      if (!results.failed) {
        this.write(TOTAL_SUCCESS, results.success);
      } else {
        this.write(TOTAL_FAILED, results.failed, results.success);
        this.write('\n\n') ;
        this._logFinalErrors(failures);
        this.write('\n\n') ;
      }
    }
    this.write('\n');
    failures = {tests: [], suites: {}};
  };

  this._logFinalErrors = function (failures, prefix) {
    prefix = prefix || '';
    failures.tests.forEach(function (failure) {
      this.write((prefix + 'IT => ' + failure.description + '\n').cyan);
      this.write((prefix + '  ERROR => ' + failure.log + '\n').red);
    }, this);
    Object.keys(failures.suites).forEach(function (suite) {
      this.write((prefix + 'DESCRIBE => ' + suite + '\n').yellow);
      this._logFinalErrors(failures.suites[suite], prefix + '  ');
    }, this);
  };

  this.onSpecComplete = function (browser, result) {
    if (result.success === false) {
      var current = failures;

      result.suite.forEach(function (suite) {
        current = current.suites[suite] = current.suites[suite] || {tests: [], suites: {}};
      }, this);
      current.tests.push(result);
    }
  };
};

SpecReporter.$inject = ['baseReporterDecorator'];

module.exports = {
  'reporter:karmaSimpleReporter': ['type', SpecReporter]
};

'use strict';

var SpecReporter = function (baseReporterDecorator, formatError, config) {
  baseReporterDecorator(this);

  require('colors');

  this.failures = [];
  this.TOTAL_SUCCESS = '\n' + 'TOTAL: %d SUCCESS'.green;
  this.TOTAL_FAILED = '\n' + 'TOTAL: %d FAILED'.red + ', ' +  '%d SUCCESS'.green;

  this.onRunComplete = function (browsers, results) {
    if (browsers.length >= 1 && !results.disconnected && !results.error) {
      if (!results.failed) {
        this.write(this.TOTAL_SUCCESS, results.success);
      } else {
        this.write(this.TOTAL_FAILED, results.failed, results.success);
        this.logFinalErrors(this.failures);
      }
    }
    this.write('\n');
    this.failures = [];
  };

  this.logFinalErrors = function (errors) {
    this.writeCommonMsg('\n\n') ;

    errors.forEach(function (failure, index) {
      index = index + 1;
      this.writeCommonMsg((index + ') ').grey) ;
      this.writeCommonMsg(('DESCRIBE => ' + failure.suite + '\n').yellow);
      this.writeCommonMsg(('IT => ' + failure.description + '\n').cyan);
      this.writeCommonMsg(('ERROR => ' + failure.log + '\n').red);
    }, this);

    this.writeCommonMsg('\n\n') ;
  };

  var reporterCfg = config.specReporter || {};
  function noop() {}
  this.onSpecFailure = function (browsers, results) {
    this.failures.push(results);
  };

  this.specFailure = reporterCfg.suppressFailed ? noop : this.onSpecFailure;
};

SpecReporter.$inject = ['baseReporterDecorator', 'formatError', 'config'];

module.exports = {
  'reporter:karmaSimpleReporter': ['type', SpecReporter]
};

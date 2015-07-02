'use strict';

var SpecReporter = function (baseReporterDecorator) {
  baseReporterDecorator(this);

  require('colors');

  var failures = [];
  var TOTAL_SUCCESS = '\n' + 'TOTAL: %d SUCCESS'.green;
  var TOTAL_FAILED = '\n' + 'TOTAL: %d FAILED'.red + ', ' +  '%d SUCCESS'.green;

  this.onRunComplete = function (browsers, results) {
    if (browsers.length >= 1 && !results.disconnected && !results.error) {
      if (!results.failed) {
        this.write(TOTAL_SUCCESS, results.success);
      } else {
        this.write(TOTAL_FAILED, results.failed, results.success);
        this._logFinalErrors(failures);
      }
    }
    this.write('\n');
    failures = [];
  };

  this._logFinalErrors = function (errors) {
    this.write('\n\n') ;

    errors.forEach(function (failure, index) {
      index = index + 1;
      this.write((index + ') \n').grey) ;
      this.write(('DESCRIBE => ' + failure.suite + '\n').yellow);
      this.write(('IT => ' + failure.description + '\n').cyan);
      this.write(('ERROR => ' + failure.log + '\n').red);
    }, this);

    this.write('\n\n') ;
  };

  this.onSpecComplete = function (browser, result) {
    if (result.success === false) {
      failures.push(result);
    }
  };
};

SpecReporter.$inject = ['baseReporterDecorator'];

module.exports = {
  'reporter:karmaSimpleReporter': ['type', SpecReporter]
};

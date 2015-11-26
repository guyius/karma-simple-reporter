'use strict';

var SimpleReporter = require('./../index')['reporter:karmaSimpleReporter'][1];
var util = require('util');

function ReporterDriver(output) {
  var config = {
    colors: true,
    specReporter: {}
  };
  var reporter;

  this.when = {
    init: function () {
      reporter = new SimpleReporter(function (self) {
        self.write = function () {
          output(util.format.apply(this, arguments));
        };
        self.writeCommonMsg = self.write;
        self.renderBrowser = function (str) {
          return str;
        };
      }, function formatter(error, ident) {
        return ident + error;
      }, config);

      return this;
    },
    successSuppressed: function () {
      config.specReporter.suppressPassed = true;
      return this;
    },
    suppressErrorSummary: function () {
      config.specReporter.suppressErrorSummary = true;
      return this;
    }
  };

  this.on = {
    specFailure: function (browser, suites, description, expects) {
      reporter.onSpecFailure(browser, {suite: suites, description: description, log: expects, success: false});
      return this;
    },
    specSuccess: function (browser, suites, description, expects) {
      reporter.specSuccess(browser, {suite: suites, description: description, log: expects, success: true});
      return this;
    },
    specSkipped: function (browser, suites, description, expects) {
      reporter.specSkipped(browser, {suite: suites, description: description, log: expects, skipped: true});
      return this;
    },
    runComplete: function (browsers, data) {
      reporter.onRunComplete(browsers, data);

      return this;
    },
    browserLog: function (log, type) {
      reporter._browsers = ['phantom'];
      reporter.onBrowserLog('phantom', log, type);

      return this;
    }
  };
}

module.exports = ReporterDriver;
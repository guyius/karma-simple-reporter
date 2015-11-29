'use strict';

require('colors');

var SpecReporter = function (baseReporterDecorator, formatError, config) {
  baseReporterDecorator(this);

  this.failures = [];

  // colorize output of BaseReporter functions
  if (config.colors) {
    this.USE_COLORS = true;
    this.SPEC_FAILURE = '%s %s FAILED'.red + '\n';
    this.SPEC_SLOW = '%s SLOW %s: %s'.yellow + '\n';
    this.ERROR = '%s ERROR'.red + '\n';
    this.FINISHED_ERROR = ' ERROR'.red;
    this.FINISHED_SUCCESS = ' SUCCESS'.green;
    this.FINISHED_DISCONNECTED = ' DISCONNECTED'.red;
    this.X_FAILED = ' (%d FAILED)'.red;
    this.TOTAL_SUCCESS = 'TOTAL: %d SUCCESS'.green + '\n';
    this.TOTAL_FAILED = 'TOTAL: ' + '%d FAILED'.red + ', ' + '%d SUCCESS'.green + '\n';
  } else {
    this.USE_COLORS = false;
  }

  this.consoleLogs = [];

  this.onRunComplete = function (browsers, results) {
    // the renderBrowser function is defined in karma/reporters/Base.js
    if (this.consoleLogs.length) {
      this.writeCommonMsg('\nConsole logs:\n'.cyan.underline);

      this.consoleLogs.forEach(function (log) {
        this.write.apply(this, log);
      }.bind(this));
    }

    if (browsers.length >= 1 && !results.disconnected && !results.error) {
      this.writeCommonMsg('\n' + browsers.map(this.renderBrowser).join('\n') + '\n');

      if (!results.failed) {
        this.write(this.TOTAL_SUCCESS, results.success);
      } else {
        this.write(this.TOTAL_FAILED, results.failed, results.success);

        if (!this.suppressErrorSummary) {
          this.logFinalErrors(this.failures);
        }
      }
    }

    this.write('\n');
    this.failures = [];
    this.currentSuite = [];
    this.consoleLogs = [];
  };

  this.logFinalErrors = function (errors) {
    this.writeCommonMsg('\n\n');
    this.WHITESPACE = '     ';

    errors.forEach(function (failure) {
      this.writeCommonMsg(('DESCRIBE => ' + failure.suite.join(' ') + '\n').yellow);
      this.writeCommonMsg((this.WHITESPACE + 'IT => ' + failure.description + '\n'));
      failure.log.forEach(function (log) {
        this.writeCommonMsg((this.WHITESPACE + this.WHITESPACE + 'ERROR => ' + formatError(log)
          .replace(/\\n/g, '\n')).red);
      }, this);
    }, this);

    this.writeCommonMsg('\n');
  };

  this.currentSuite = [];

  this.writeSpecMessage = function (status) {
    return (function (browser, result) {
      var suites = result.suite;
      var indent = '';
      suites.forEach(function (value, index) {
        if (index >= this.currentSuite.length || this.currentSuite[index] != value) {
          value = 'DESCRIBE => ' + value;
          value = this.USE_COLORS ? value.yellow : value;
          this.writeCommonMsg('\n' + indent + value);
          this.currentSuite = [];
        }
        indent += '  ';
      }, this);
      this.currentSuite = suites;

      var specName = 'IT => ' + result.description;

      if (this.USE_COLORS) {
        if (result.skipped) specName = specName.cyan;
      }

      var msg = '\n' + indent + specName + '\n';
      indent += '  ';

      result.log.forEach(function (log) {
        if (reporterCfg.maxLogLines) {
          log = log.split('\n').slice(0, reporterCfg.maxLogLines).join('\n');
        }

        if (this.USE_COLORS) {
          log = (result.success) ? log.green : log.red;
        }

        msg += formatError(status + log, indent);
      }.bind(this));


      this.writeCommonMsg(msg);

      // other useful properties
      browser.id;
      browser.fullName;
      result.time;
      result.skipped;
      result.success;
    }).bind(this);
  };

  this.LOG_SINGLE_BROWSER = '  %s: %s\n';
  this.LOG_MULTI_BROWSER = '  %s %s: %s\n';
  this.onBrowserLog = function (browser, log, type) {

    if (this.USE_COLORS) {
      switch (type) {
        case 'log':
          log = '  ' + log.blue;
          break;
        case 'warn':
          log = ' ' + log.yellow;
          break;
        case 'error':
          log = log.red;
          break;
      }
    }

    if (this._browsers && this._browsers.length === 1) {
      this.consoleLogs.push([this.LOG_SINGLE_BROWSER, type, log]);
    } else {
      this.consoleLogs.push([this.LOG_MULTI_BROWSER, browser, type, log]);
    }
  };

  var reporterCfg = config.specReporter || {};
  var prefixes = reporterCfg.prefixes || {
      success: '✓ ',
      failure: '✗ ',
      skipped: '- '
    };

  function noop() {
  }

  this.onSpecFailure = function (browsers, results) {
    this.failures.push(results);
    this.writeSpecMessage(this.USE_COLORS ? prefixes.failure.red : prefixes.failure).apply(this, arguments);
  };

  this.specSuccess = reporterCfg.suppressPassed ? noop : this.writeSpecMessage(this.USE_COLORS ? prefixes.success.green : prefixes.success);
  this.specSkipped = reporterCfg.suppressSkipped ? noop : this.writeSpecMessage(this.USE_COLORS ? prefixes.skipped.cyan : prefixes.skipped);
  this.specFailure = reporterCfg.suppressFailed ? noop : this.onSpecFailure;
  this.suppressErrorSummary = reporterCfg.suppressErrorSummary || false;
};

SpecReporter.$inject = ['baseReporterDecorator', 'formatError', 'config'];

module.exports = {
  'reporter:karmaSimpleReporter': ['type', SpecReporter]
};


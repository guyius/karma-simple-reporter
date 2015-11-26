# karma-simple-reporter
[![NPM version](https://img.shields.io/npm/v/karma-simple-reporter.svg?style=flat)](https://www.npmjs.com/package/karma-simple-reporter)
 [![Build Status](https://travis-ci.org/guyius/karma-simple-reporter.svg)](https://travis-ci.org/guyius/karma-simple-reporter)
>Minimalist Karma test reporter, that prints simple colorful results to the console.

## Configuration
``` js
//karma.conf.js
...
  plugins: ["karma-simple-reporter"],
  config.set({
    ...
      reporters: ["karmaSimpleReporter"],
      specReporter: {
        suppressPassed: true,
        suppressSkipped: true,
        suppressFailed: true,
        suppressErrorSummary: true, 
        maxLogLines: 5,
        prefixes: {
          success: '✓ ',
          failure: '✗ ',
          skipped: '- '
        }
    }
    ...
```

## Report preview
![alt text](http://i.imgur.com/o9miVqG.png "preview")

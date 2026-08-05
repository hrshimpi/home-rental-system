module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {},
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/hrs-frontend'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }],
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    // `npm run test:ci` (see package.json / the CI workflow) passes
    // --browsers=ChromeHeadless on the command line rather than
    // relying on a customLaunchers entry here - Angular's karma
    // builder (@angular-devkit/build-angular:karma) constructs its
    // own internal karma config and doesn't merge customLaunchers
    // defined in this file, confirmed empirically; it does honor a
    // --browsers override naming one of karma-chrome-launcher's
    // built-in launchers, which ChromeHeadless already is.
    singleRun: false,
    restartOnFileChange: true,
  });
};

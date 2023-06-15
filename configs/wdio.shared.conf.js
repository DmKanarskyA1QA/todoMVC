const fs = require("fs-extra");
const timeouts = require("../configs/environment/timeouts");
const Logger = require("../src/framework/logger");
const { generate } = require("cucumber-html-reporter");
const cucumberJson = require("wdio-cucumberjs-json-reporter");

const jsonReportDirectory = "reports/json/";
const screenshotsDirectory = "reports/screenshots/";
const htmlReportDirectory = "reports/html/";

exports.config = {
  runner: "local",
  specs: ["../src/test/features/**/*.feature"],
  exclude: [],
  maxInstances: 1, // Must always be 1
  logLevel: "warn",
  bail: 0,
  waitforTimeout: timeouts.explicit,
  framework: "cucumber",
  reporters: [
    [
      "cucumberjs-json",
      {
        jsonFolder: jsonReportDirectory,
        language: "en"
      },
    ],
  ],
  cucumberOpts: {
    require: ["./src/test/steps/**/*.js"],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    format: ["pretty"],
    snippets: true,
    source: true,
    profile: [],
    strict: false,
    tagExpression: "@automated",
    timeout: timeouts.cucumberStep,
    ignoreUndefinedDefinitions: false,
  },

  onPrepare: async function () {
    fs.removeSync(jsonReportDirectory);
    fs.mkdirSync(jsonReportDirectory, { recursive: true });
    fs.removeSync(screenshotsDirectory);
    fs.mkdirSync(screenshotsDirectory, { recursive: true });
    fs.mkdirSync(htmlReportDirectory, { recursive: true });
  },

  beforeScenario: async function () {
    await browser.reloadSession();
  },

  afterScenario: async function (testCase, result) {
    try {
      if (!result.passed) {
        const name = `${new Date().getTime()}.png`;
        const screen = await browser.takeScreenshot();
        this.path = `${screenshotsDirectory}${name}`;
        fs.writeFileSync(this.path, screen, "base64", (err) => {
          Logger.error(err);
        });
        cucumberJson.attach(screen, "image/png");
      }
    } catch (err) {
      Logger.error(err);
    }
  },

  onComplete: function () {
    const options = {
      theme: "bootstrap",
      output: "./reports/html/report.html",
      jsonDir: jsonReportDirectory,
      reportSuiteAsScenarios: true,
      scenarioTimestamp: true,
      launchReport: false,
      name: "TodoMVC app tests",
      brandTitle: "TodoMVC app tests",
    };
    generate(options);
  },
};

const { config } = require("./wdio.shared.conf");

exports.config = {
  ...config,
  ...{
    capabilities: [
      {
        browserName: "chrome",
        "goog:chromeOptions": {
          args: ["--incognito", "--no-sandbox"],
        },
      },
    ],
    services: ["chromedriver"],
  },
};

# Automation solution for todo MVC application

This automation solution is using the following tools:

* [Node.JS](https://nodejs.org/) - JavaScript runtime environemtn
* [Cucumber](https://cucumber.io/) - BDD tools and techniques
* [Chai](https://www.chaijs.com/) - JavaScript assertion library
* [WebdriverIO](https://webdriver.io/) - Browser and mobile automation framework
* [VSCode](https://code.visualstudio.com/) - Open source code editor
* [ESLint](https://eslint.org/) - JavaScript linting tool

# Overview
## Folder structure
| Folder             | Description                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| /configs           | contains configs for different browsers                                                                  |
| /reports           | contains reports generated after test                                                                     |
| /src/test/pages    | page objects                                                                                              |
| /src/test/forms    | same as page objects but for forms                                                                        |
| /src/environment   | environment configs                                                                                       | 
| /src/test/features | contains feature-files with BDD scenarios                                                                 |
| /src/test/steps    | contains steps definitions for auto tests                                                                 |

## Temp folders
| Folder        | Description                                       |
| ------------- | ------------------------------------------------- |
| /node_modules | node.js folder. stores downloaded node.js modules |

# Running tests

Open terminal in project code folder and write one of the following commands:
   * `npm run test:chrome`
   * `npm run test:firefox`

> NOTE: if you want to run in the headless mode, add `--headless` line to the browser config in `/configs` folder.

# Look at the report
After you executed your test, the report will be generated. You can find it in `/reports/html` folder.
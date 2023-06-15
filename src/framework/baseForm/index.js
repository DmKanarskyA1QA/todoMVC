const Element = require("../element");
const Logger = require("../logger");
const timeouts = require("../../../configs/environment/timeouts");

module.exports = class BaseForm {
  constructor(locator, name) {
    this.locator = locator;
    this.name = name;
    this.form = new Element(this.locator, this.name);
  }

  /**
   * Get name of the form
   * @returns {string} Name of the form
   */
  getFormName() {
    return this.name;
  }

  /**
   * Check if the form is opened, without timeout
   * @returns {Promise<boolean>} true if opened else false
   */
  async isFormOpened() {
    const isOpened = await this.form.state().isDisplayed();
    Logger.info(`Form "${this.name}" is opened - "${isOpened}"`);
    return isOpened;
  }

  /**
   * Check if the form is opened, with 'pageLoadTime' timeout
   * @returns {Promise<boolean>} true if opened else false
   */
  async waitForFormIsOpened() {
    Logger.info(`Waiting for form "${this.name}" to load`);
    const isOpened = await this.form
      .state()
      .waitForDisplayed({timeout: timeouts.pageLoadTime, interval: timeouts.polling, reverse: false});
    Logger.info(`Form "${this.name}" is opened - "${isOpened}"`);
    return isOpened;
  }
};

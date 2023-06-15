const Logger = require("../logger");
const timeouts = require("../../../configs/environment/timeouts");

const elementState = {
  exist: "exist",
  enabled: "enabled",
  clickable: "clickable",
  displayed: "displayed",
};

module.exports = class ElementStateProvider {
  constructor(locator, name) {
    this.locator = locator;
    this.name = name;
  }

  /**
   * Check if element is existing
   * @returns {Promise<boolean>} true if existing else false
   */
  async isExisting() {
    Logger.info(`Is element "${this.name}" existing`);
    return (await $(this.locator)).isExisting();
  }

  /**
   * Check if element is clickable
   * @returns {Promise<boolean>} true if clickable else false
   */
  async isClickable() {
    Logger.info(`Is element "${this.name}" clickable`);
    return (await $(this.locator)).isClickable();
  }

  /**
   * Check if element is displayed
   * @returns {Promise<boolean>} true if displayed else false
   */
  async isDisplayed() {
    Logger.info(`Is element "${this.name}" displayed`);
    return (await $(this.locator)).isDisplayed();
  }

  /**
   * Check if element is enabled
   * @returns {Promise<boolean>} true if enabled else false
   */
  async isEnabled() {
    Logger.info(`Is element "${this.name}" enabled`);
    return (await $(this.locator)).isEnabled();
  }

  /**
   * Check if element is selected ('option' or 'input' element or 'checkbox' or 'radio' type)
   * @returns {Promise<boolean>} true if selected else false
   */
  async isSelected() {
    Logger.info(`Is element "${this.name}" selected`);
    return (await $(this.locator)).isSelected();
  }

  /**
   * Wait for element to exist
   * @param {object} options Options for waiting
   * @returns {Promise<boolean>} true if exists else false
   */
  async waitForExist(
    { timeout, interval, reverse } = {
      timeout: timeouts.explicit,
      interval: timeouts.polling,
      reverse: false,
    }
  ) {
    const func = async (options) => await (await $(this.locator)).waitForExist(options);
    return this._waitFor(func, { timeout, interval, reverse }, elementState.exist);
  }

  /**
   * Wait for element to be enabled
   * @param {object} options Options for waiting
   * @returns {Promise<boolean>} true if enabled else false
   */
  async waitForEnabled(
    { timeout, interval, reverse } = {
      timeout: timeouts.explicit,
      interval: timeouts.polling,
      reverse: false,
    }
  ) {
    const func = async (options) => await (await $(this.locator)).waitForEnabled(options);
    return this._waitFor(func, { timeout, interval, reverse }, elementState.enabled);
  }

  /**
   * Wait for element to be displayed
   * @param {object} options Options for waiting
   * @returns {Promise<boolean>} true if displayed else false
   */
  async waitForDisplayed(
    { timeout, interval, reverse } = {
      timeout: timeouts.explicit,
      interval: timeouts.polling,
      reverse: false,
    }
  ) {
    const func = async (options) => await (await $(this.locator)).waitForDisplayed(options);
    return this._waitFor(func, { timeout, interval, reverse }, elementState.displayed);
  }

  /**
   * Wait for element to disappear
   * @param {object} options Options for waiting
   * @returns {Promise<boolean>} true if disappeared else false
   */
  async waitForDisappear(
    { timeout, interval, reverse } = {
      timeout: timeouts.disappear,
      interval: timeouts.polling,
      reverse: true,
    }
  ) {
    const func = async (options) => await (await $(this.locator)).waitForDisplayed(options);
    return this._waitFor(func, { timeout, interval, reverse }, elementState.displayed);
  }

  /**
   * Wait for element to be clickable
   * @param {object} options Options for waiting
   * @returns {Promise<boolean>} true if clickable else false
   */
  async waitForClickable(
    { timeout, interval, reverse } = {
      timeout: timeouts.explicit,
      interval: timeouts.polling,
      reverse: false,
    }
  ) {
    const func = async (options) => await (await $(this.locator)).waitForClickable(options);
    return this._waitFor(func, { timeout, interval, reverse }, elementState.clickable);
  }

  /**
   * Assert that element exists
   * @param {object} options Options for assertion
   * @returns {Promise<true|void>} true if exists else throw
   */
  async assertIsExist(
    { timeout, interval, reverse } = {
      timeout: timeouts.explicit,
      interval: timeouts.polling,
      reverse: false,
    }
  ) {
    const func = async (options) => await (await $(this.locator)).waitForExist(options);
    return this._assertIs(func, { timeout, interval, reverse }, elementState.exist);
  }

  /**
   * Assert that element is enabled
   * @param {object} options Options for assertion
   * @returns {Promise<true|void>} true if enabled else throw
   */
  async assertIsEnabled(
    { timeout, interval, reverse } = {
      timeout: timeouts.explicit,
      interval: timeouts.polling,
      reverse: false,
    }
  ) {
    const func = async (options) => await (await $(this.locator)).waitForEnabled(options);
    return this._assertIs(func, { timeout, interval, reverse }, elementState.enabled);
  }

  /**
   * Assert that element is displayed
   * @param {object} options Options for assertion
   * @returns {Promise<true|void>} true if displayed else throw
   */
  async assertIsDisplayed(
    { timeout, interval, reverse } = {
      timeout: timeouts.explicit,
      interval: timeouts.polling,
      reverse: false,
    }
  ) {
    const func = async (options) => await (await $(this.locator)).waitForDisplayed(options);
    return this._assertIs(func, { timeout, interval, reverse }, elementState.displayed);
  }

  /**
   * Assert that element is clickable
   * @param {object} options Options for assertion
   * @returns {Promise<true|void>} true if clickable else throw
   */
  async assertIsClickable(
    { timeout, interval, reverse } = {
      timeout: timeouts.explicit,
      interval: timeouts.polling,
      reverse: false,
    }
  ) {
    const func = async (options) => await (await $(this.locator)).waitForClickable(options);
    return this._assertIs(func, { timeout, interval, reverse }, elementState.clickable);
  }

  /**
   * Wait for element to be in state
   * @param {function} func Waiter function
   * @param {object} options Options for waiter function
   * @param {string} state State to wait for
   * @returns {Promise<boolean>} true if in state else false
   */
  async _waitFor(func, options, state) {
    state = options.reverse === false ? state : `not ${state}`;
    Logger.info(`Waiting (${options.timeout} ms) for element "${this.name}" is ${state}`);
    try {
      await func(options);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Assert that element is in state
   * @param {function} func Assertion function
   * @param {object} options Options for assertion function
   * @param {string} state State to assert
   * @returns {Promise<true|void>} true if in state else throw
   */
  async _assertIs(func, options, state) {
    state = options.reverse === false ? state : `not ${state}`;
    Logger.info(`Assertion that element "${this.name}" is ${state}`);
    options.timeoutMsg = `Element "${this.name}" was not in state "${state}". Locator: ${this.locator}`;
    return func(options);
  }
};

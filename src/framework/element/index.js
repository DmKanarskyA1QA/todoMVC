const Logger = require("../logger");
const ElementStateProvider = require("./elementStateProvider");
const { Key } = require("webdriverio");

const maskedValue = "********";

module.exports = class Element {
  constructor(locator, name) {
    this.locator = locator;
    this.name = name;
  }

  state = () => new ElementStateProvider(this.locator, this.name);

  /**
   * Click on element
   * @param {object} options Options containing additional settings
   * @returns {Promise<void>}
   */
  async click({ viaJS } = { viaJS: false }) {
    Logger.info(`Click at '${this.name}'`);
    const element = await this.getWebElement();
    if (viaJS) {
      return browser.execute("arguments[0].click();", element);
    } else {
      return element.click();
    }
  }

  /**
   * Double-click on element
   * @param {object} options Options containing additional settings
   * @returns {Promise<void>}
   */
  async doubleClick() {
    Logger.info(`Double-click at '${this.name}'`);
    await (await this.getWebElement()).doubleClick();
  }

  /**
   * Click on element via JS
   * @returns {Promise<void>}
   */
  async clickViaJS() {
    return this.click({ viaJS: true });
  }

  /**
   * Get text from element
   * @returns {Promise<string>} Text from element
   */
  async getText() {
    Logger.info(`Get text from element "${this.name}"`);
    const text = await (await this.getWebElement()).getText();
    Logger.info(`Received text "${text}"`);
    return text;
  }

  /**
   * Get text from elements
   * @returns {Promise<Array<string>>} Text from elements
   */
  async getTextFromElements() {
    await this.state().assertIsExist();
    Logger.info(`Get text from elements "${this.name}"`);
    let elements = await $$(this.locator);
    let texts = [];
    let length = elements.length;
    let index = 0;
    while (index < length) {
      texts.push(await elements[index].getText());
      index++;
    }
    return texts;
  }

  /**
   * Scroll element into view
   * @param {object} scrollIntoViewOptions Options for `scrollIntoView` method from webdriverIO
   * @returns
   */
  async scrollIntoView(scrollIntoViewOptions = true) {
    Logger.info(`Scroll to element ${this.name}`);
    const element = await this.getWebElement();
    return element.scrollIntoView(scrollIntoViewOptions);
  }

  /**
   * Type text in element
   * @param {string} value Text to type
   * @returns {Promise<void>}
   */
  async type(value) {
    Logger.info(`Type text ${value}`);
    await (await this.getWebElement()).addValue(value);
  }

  /**
   * Clear and type text in element
   * @param {string} value Text to type
   * @returns {Promise<void>}
   */
  async clearAndType(value) {
    Logger.info(`Type text ${value}`);
    const element = await this.getWebElement();
    return element.setValue(value);
  }

  /**
   * Get placeholder from element
   * @returns {Promise<string>} Placeholder
   */
  async getPlaceholder() {
    return this.getAttribute("placeholder");
  }

  /**
   * Get value of the attribute from element
   * @param {string} attribute Name of the attribute
   * @returns {Promise<string>} Attribute value
   */
  async getAttribute(attribute) {
    Logger.info(`Get attribute "${attribute}" from element "${this.name}"`);
    const attr = await (await this.getWebElement()).getAttribute(attribute);
    Logger.info(`Received attribute "${attr}"`);
    return attr;
  }

  /**
   * Get value of the element
   * @returns {Promise<string>} Value
   */
  async getValue() {
    Logger.info(`Get value from element "${this.name}"`);
    return (await this.getWebElement()).getValue();
  }

  /**
   * Switch to frame of the element
   * @returns {Promise<void>}
   */
  async switchToFrame() {
    Logger.info(`Switch "${this.name}" to new frame `);
    const elem = await this.getWebElement();
    return browser.switchToFrame(elem);
  }

  /**
   * Move to element
   * @returns {Promise<void>}
   */
  async moveTo() {
    Logger.info(`Move to "${this.name}"`);
    return (await this.getWebElement()).moveTo();
  }

  /**
   * Clear text in element
   * @returns {Promise<void>}
   */
  async clear() {
    Logger.info("Clear text");
    await this.getWebElement().clearValue();
  }

  /**
   * Clear the element in the old way by emptying it out with keyboard inputs
   */
  async clearWithKeys() {
    Logger.info("Clear text");
    await (await this.getWebElement()).click();
    await browser.keys([Key.Control, "a"]);
    await browser.keys(Key.Backspace);
  }

  async getWebElement() {
    await this.state().assertIsExist();
    return $(this.locator);
  }
};

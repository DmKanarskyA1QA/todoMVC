const BaseForm = require("../../../framework").BaseForm;
const Element = require("../../../framework").Element;
const { Key } = require("webdriverio");

module.exports = class TodoItemForm extends BaseForm {
  constructor(itemName) {
    super(`//ul[contains(@class, 'todo-list')]//label[text() = '${itemName}']//ancestor::li`, `Todo item ${itemName}`);
    this.itemName = itemName;
  }

  get itemCheckbox() {
    return new Element(`${this.locator}//input[contains(@class, 'toggle')]`, "Complete item checkbox");
  }

  get itemNameLabel() {
    return new Element(`${this.locator}//label`, "Item name label");
  }

  get editItemInput() {
    return new Element(`${this.locator}//input[contains(@class, 'edit')]`, "Edit item input");
  }

  get deleteItemButton() {
    return new Element(`${this.locator}//button[contains(@class, 'destroy')]`, "Delete item button");
  }

  getItemName() {
    return this.itemName;
  }

  async complete() {
    if (!(await this.isCompleted())) {
      await this.itemCheckbox.clickViaJS();
    }
  }

  async activate() {
    if (await this.isCompleted()) {
      await this.itemCheckbox.clickViaJS();
    }
  }

  async isCompleted() {
    const classValue = await this.form.getAttribute("class");
    return classValue === null ? false : classValue.includes("completed");
  }

  async editTodo(newTodoName) {
    await this.itemNameLabel.doubleClick();
    await this.editItemInput.clearWithKeys();
    await this.editItemInput.type(newTodoName);
    await browser.keys(Key.Enter);
  }

  async deleteItem() {
    await this.itemNameLabel.scrollIntoView();
    await this.itemNameLabel.moveTo();
    await this.deleteItemButton.click();
    await this.form.state().waitForDisappear();
  }

};

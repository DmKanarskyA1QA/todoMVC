const BaseForm = require("../../../framework").BaseForm;
const Element = require("../../../framework").Element;
const { Key } = require("webdriverio");
const TodoItemForm = require("../../forms/todoItemForm");

module.exports = class Angular2ExamplePage extends BaseForm {
  constructor() {
    super("//input[contains(@class, 'new-todo')]", "Todo MVC Angualar 2.0 page");
  }

  get newTodoInput() {
    return new Element("//input[contains(@class, 'new-todo')]", "New todo input");
  }

  get todoCountLabel() {
    return new Element("//span[contains(@class, 'todo-count')]//strong", "Active todos count");
  }

  get clearCompletedButton() {
    return new Element("//button[contains(@class, 'clear-completed')]", "Clear button");
  }

  getAllTodoItems() {
    return new Element("//ul[contains(@class, 'todo-list')]//li", "All items");
  }

  /**
   *
   * @returns {Promise<Array<TodoItemForm>>}
   */
  async getAllTodos() {
    const allTodos = [];
    const allTodoNames = await this.getAllTodoNames();
    for (const todoName of allTodoNames) {
      allTodos.push(new TodoItemForm(todoName));
    }
    return allTodos;
  }

  async isTodoListEmpty() {
    return !(await this.getAllTodoItems().state().isDisplayed());
  }

  async getAllTodoNames() {
    return await this.getAllTodoItems().getTextFromElements();
  }

  async getActiveTodoItemForms() {
    const activeTodoItemForms = [];
    const allTodoItems = await this.getAllTodos();
    for (const todoItem of allTodoItems) {
      if (!(await todoItem.isCompleted())) {
        activeTodoItemForms.push(todoItem);
      }
    }
    return activeTodoItemForms;
  }

  async getCompletedTodoItemForms() {
    const completedTodoItemForms = [];
    const allTodoItems = await this.getAllTodos();
    for (const todoItem of allTodoItems) {
      if (await todoItem.isCompleted()) {
        completedTodoItemForms.push(todoItem);
      }
    }
    return completedTodoItemForms;
  }

  async getLastTodo() {
    return (await this.getAllTodoNames()).pop();
  }

  async isActiveItemsCountDisplayed() {
    return this.todoCountLabel.state().isDisplayed();
  }

  async getItemsCount() {
    return Number(await this.todoCountLabel.getText());
  }

  async addNewTodo(todoName) {
    await this.newTodoInput.click();
    await this.newTodoInput.clearAndType(todoName);
    await browser.keys(Key.Enter);
  }

  /**
   *
   * @param {*} todoName
   * @returns {Promise<TodoItemForm>}
   */
  async getTodoItemForm(todoName) {
    return (await this.getAllTodos()).find((todo) => todo.getItemName() === todoName);
  }

  async clickClearCompletedButton() {
    await this.clearCompletedButton.click();
  }

  async isClearCompletedButtonNotDisplayed() {
    return this.clearCompletedButton.state().waitForDisappear();
  }

}
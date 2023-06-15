const { When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const env = require("../../../configs/environment/env");
const Angular2ExamplePage = require("../pages/angular2ExamplePage");
const _ = require("lodash");
const RandomUtil = require("../../framework/utils/randomUtils");

const angular2ExamplePage = new Angular2ExamplePage();

When(/^open the todoMVC page$/, async function () {
  browser.url(env.todoMvcPage);
});

Then(/^the todoMVC page is displayed$/, async function () {
  await angular2ExamplePage.waitForFormIsOpened();
  expect(await angular2ExamplePage.isFormOpened(), `The ${env.todoMvcPage} should be opened`).to.be.true;
});

When(/^add todo '(.*)'$/, async function (todoName) {
  await angular2ExamplePage.addNewTodo(todoName);
  shareAddedTodo(this, todoName);
});

When(/^add a random todo with length '(\d+)'$/, async function (todoLength) {
  const randomTodoName = RandomUtil.generateRandomString(todoLength);
  await angular2ExamplePage.addNewTodo(randomTodoName);
  shareAddedTodo(this, randomTodoName);
});

Then(/^the specified todos were added to the end of the list$/, async function () {
  const actualTodos = await angular2ExamplePage.getAllTodoNames();
  const addedTodosReverse = getSharedAddedTodos(this).reverse();
  for (const addedTodo of addedTodosReverse) {
    const actualTodo = actualTodos.pop();
    expect(actualTodo).to.be.equal(addedTodo, `Added ${addedTodo} should be equal to the ${actualTodo} from the list`);
  }
});

Then(/^todo list is empty$/, async function () {
  expect(await angular2ExamplePage.isTodoListEmpty(), "Todo list should be empty").to.be.true;
});

Then(/^todo count is equal to the number of active todo items$/, async function () {
  const itemsLength = (await angular2ExamplePage.getAllTodoNames()).length;
  const count = await angular2ExamplePage.getItemsCount();
  expect(itemsLength).to.be.equal(count, "The number of items should be equal to the number of active todo items");
});

When(/^add '(\d+)' random todos$/, async function (todosNumber) {
  for (let i = 0; i < todosNumber; i++) {
    const randomTodoName = RandomUtil.generateRandomString();
    await angular2ExamplePage.addNewTodo(randomTodoName);
    shareAddedTodo(this, randomTodoName);
  }
});

When(/^complete '(\d+)' random active todos$/, async function (todoNumber) {
  for (let i = 0; i < todoNumber; i++) {
    const allActiveTodos = await angular2ExamplePage.getActiveTodoItemForms();
    const randomActiveTodo = allActiveTodos[RandomUtil.getRandomInt(0, allActiveTodos.length - 1)];
    await randomActiveTodo.complete();
    shareCompletedTodo(this, randomActiveTodo.getItemName());
  }
});

When(/^activate '(\d+)' random completed todos$/, async function (todoNumber) {
  for (let i = 0; i < todoNumber; i++) {
    const allCompletedTodos = await angular2ExamplePage.getCompletedTodoItemForms();
    const randomCompletedTodo = allCompletedTodos[RandomUtil.getRandomInt(0, allCompletedTodos.length - 1)];
    await randomCompletedTodo.activate();
    shareActivatedTodo(this, randomCompletedTodo.getItemName());
  }
});

When(/^set the name of the random active todo as '(.*|random)'$/, async function (newTodoName) {
  this.todoNameAfterEdit = newTodoName === "random" ? RandomUtil.generateRandomString() : newTodoName;
  const allActiveTodos = await angular2ExamplePage.getActiveTodoItemForms();
  const itemIndexToEdit = RandomUtil.getRandomInt(0, allActiveTodos.length - 1);
  const randomTodo = allActiveTodos[itemIndexToEdit];
  this.todoNameBeforeEdit = randomTodo.getItemName();
  await randomTodo.editTodo(this.todoNameAfterEdit);
  this.editedItemIndex = itemIndexToEdit;
});

When(/^set the name of the random completed todo as '(.*|random)'$/, async function (newTodoName) {
  this.todoNameAfterEdit = newTodoName === "random" ? RandomUtil.generateRandomString() : newTodoName;
  const allCompletedTodos = await angular2ExamplePage.getCompletedTodoItemForms();
  const itemIndexToEdit = RandomUtil.getRandomInt(0, allCompletedTodos.length - 1);
  const randomTodo = allCompletedTodos[itemIndexToEdit];
  this.todoNameBeforeEdit = randomTodo.getItemName();
  await randomTodo.editTodo(this.todoNameAfterEdit);
  this.editedItemIndex = itemIndexToEdit;
});

When(/^the edited todo has been deleted$/, async function () {
  const allTodoNames = await angular2ExamplePage.getAllTodoNames();
  expect(
    allTodoNames.includes(this.todoNameBeforeEdit),
    `Todos list shouldn't contain ${this.todoNameBeforeEdit} item`
  ).to.be.false;
  expect(
    allTodoNames.includes(this.todoNameAfterEdit),
    `Todos list shouldn't contain ${this.todoNameAfterEdit} item`
  ).to.be.false;
});

When(/^delete '(\d+)' random active todos$/, async function (todoNumber) {
  for (let i = 0; i < todoNumber; i++) {
    const allActiveTodos = await angular2ExamplePage.getActiveTodoItemForms();
    const itemIndexToEdit = RandomUtil.getRandomInt(0, allActiveTodos.length - 1);
    const randomActiveTodo = allActiveTodos[itemIndexToEdit];
    await randomActiveTodo.deleteItem();
    shareDeletedTodo(this, randomActiveTodo.getFormName());
  }
});

When(/^delete '(\d+)' random completed todos$/, async function (todoNumber) {
  for (let i = 0; i < todoNumber; i++) {
    const allCompletedTodos = await angular2ExamplePage.getCompletedTodoItemForms();
    const itemIndexToEdit = RandomUtil.getRandomInt(0, allCompletedTodos.length - 1);
    const randomCompletedTodo = allCompletedTodos[itemIndexToEdit];
    await randomCompletedTodo.deleteItem();
    shareDeletedTodo(this, randomCompletedTodo.getFormName());
  }
});

When(/^click Clear completed button$/, async function () {
  shareDeletedTodo(
    this,
    (await angular2ExamplePage.getCompletedTodoItemForms()).map((todoForm) => todoForm.getItemName())
  );
  await angular2ExamplePage.clickClearCompletedButton();
});

Then(/^Clear completed button is not displayed$/, async function () {
  expect(
    await angular2ExamplePage.isClearCompletedButtonNotDisplayed(),
    "'Clear completed' shouldn't be displayed"
  ).to.be.true;
});

Then(/^the deleted todos are not present in the todo list$/, async function () {
  const allTodos = await angular2ExamplePage.getAllTodoNames();
  const areAllItemsDeleted = getSharedDeletedTodos(this).every(
    (deletedTodoName) => !allTodos.includes(deletedTodoName)
  );
  expect(areAllItemsDeleted, "Deleted todos shouldn't be in the todos list").to.be.true;
});

Then(/^the selected item has been edited$/, async function () {
  expect(this.todoNameBeforeEdit).to.be.not.equal(
    this.todoNameAfterEdit,
    `The item ${this.todoNameBeforeEdit} shouldn't be in the todos list`
  );
});

Then(/^the selected todos should be completed$/, async function () {
  for (const completedTodo of getSharedCompletedTodos(this)) {
    expect(
      await (await angular2ExamplePage.getTodoItemForm(completedTodo)).isCompleted(),
      `The ${completedTodo} todo should be in the 'Completed' state`
    ).to.be.true;
  }
});

Then(/^the selected todos should be active$/, async function () {
  for (const completedTodo of getSharedCompletedTodos(this)) {
    expect(
      await (await angular2ExamplePage.getTodoItemForm(completedTodo)).isCompleted(),
      `The ${completedTodo} todo should not be in the 'Completed' state`
    ).to.be.false;
  }
});

Then(/^the active todos counter value should be igreater than 0$/, async function () {
  const count = await angular2ExamplePage.getItemsCount();
  expect(count).to.be.greaterThan(0, "The value of the todos counter should be greater than 0");
  this.sharedTodosCount = count;
});

Then(
  /^the current value of the todos counter should be less than the previous value by '(\d+)'$/,
  async function (todosDifference) {
    const currentCount = await angular2ExamplePage.getItemsCount();
    expect(this.sharedTodosCount - currentCount).to.be.equal(
      todosDifference,
      `The todos counter current value must be less than the previous value by ${todosDifference}`
    );
    this.sharedTodosCount = currentCount;
  }
);

Then(
  /^the current value of the todos counter should be greater than the previous value by '(\d+)'$/,
  async function (todosDifference) {
    const currentCount = await angular2ExamplePage.getItemsCount();
    expect(currentCount - this.sharedTodosCount).to.be.equal(
      todosDifference,
      `The todos counter current value must be greater than the previous value by ${todosDifference}`
    );
    this.sharedTodosCount = currentCount;
  }
);

Then(/^the todos counter value has not changed$/, async function () {
  const currentCount = await angular2ExamplePage.getItemsCount();
  expect(currentCount).to.be.equal(this.sharedTodosCount, "The curr");
});

Then(/^todo count is not present on the page$/, async function () {
  expect(await angular2ExamplePage.isActiveItemsCountDisplayed(), "Not displayed").to.be.false;
});

function shareAddedTodo(world, todoName) {
  if (_.isNil(world.sharedAddedTodos)) {
    world.sharedAddedTodos = [];
  }
  world.sharedAddedTodos.push(todoName);
}

function getSharedAddedTodos(world) {
  return world.sharedAddedTodos;
}

function shareCompletedTodo(world, todoName) {
  if (_.isNil(world.sharedCompletedTodos)) {
    world.sharedCompletedTodos = [];
  }
  world.sharedCompletedTodos.push(todoName);
}

function getSharedCompletedTodos(world) {
  return world.sharedCompletedTodos;
}

function shareActivatedTodo(world, todoName) {
  if (_.isNil(world.sharedActivatedTodos)) {
    world.sharedActivatedTodos = [];
  }
  world.sharedActivatedTodos.push(todoName);
}

function shareDeletedTodo(world, ...todoName) {
  if (_.isNil(world.sharedDeletedTodos)) {
    world.sharedDeletedTodos = [];
  }
  world.sharedDeletedTodos.push(todoName);
}

function getSharedDeletedTodos(world) {
  return world.sharedDeletedTodos;
}

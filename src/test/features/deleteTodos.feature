@automated @deleteTodos
Feature: Tests for the 'delete todo' function

  Background: Open todoMVC page and add '10' random todos
    When open the todoMVC page
    Then the todoMVC page is displayed
    When add '10' random todos
    Then the active todos counter value should be igreater than 0

  @MAT
  Scenario Outline: Check the ability to delete active todo
    When delete '<todosNumber>' random active todos
    Then the deleted todos are not present in the todo list
    And the current value of the todos counter should be less than the previous value by '<todosNumber>'

    Examples:
      | todosNumber |
      | 1           |
      | 2           |
      | 9           |

  @MAT
  Scenario Outline: Check the ability to delete completed todo
    When complete '<todosNumber>' random active todos
    Then the selected todos should be completed
    And the current value of the todos counter should be less than the previous value by '<todosNumber>'
    When delete '<todosNumber>' random completed todos
    Then the deleted todos are not present in the todo list
    And the todos counter value has not changed

    Examples:
      | todosNumber |
      | 1           |
      | 2           |
      | 9           |
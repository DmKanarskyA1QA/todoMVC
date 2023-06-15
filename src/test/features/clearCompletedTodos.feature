@automated @clearCompletedTodos
Feature: Tests for the 'clear completed todos' function

  Background: Open todoMVC page and add '10' random todos
    When open the todoMVC page
    Then the todoMVC page is displayed
    When add '10' random todos
    Then the active todos counter value should be igreater than 0

  @MAT
  Scenario Outline: Check the ability to clear completed todos
    When complete '<todosNumber>' random active todos
    Then the selected todos should be completed
    And the current value of the todos counter should be less than the previous value by '<todosNumber>'
    When click Clear completed button
    Then the deleted todos are not present in the todo list
    And the todos counter value has not changed
    And Clear completed button is not displayed

    Examples:
      | todosNumber |
      | 1           |
      | 2           |
      | 9           |

  @AT
  Scenario Outline: Check that the Clear completed button is not displayd when there is not items in the 'Completed' status
    Then Clear completed button is not displayed

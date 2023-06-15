@automated @completeTodos
Feature: Tests for the 'complete todo' function

  Background: Open todoMVC page and add '10' random todos
    When open the todoMVC page
    Then the todoMVC page is displayed
    When add '10' random todos
    Then the active todos counter value should be igreater than 0
    And todo count is equal to the number of active todo items

  @MAT
  Scenario Outline: Check the ability to complete '<todosNumber>' todos
    When complete '<todosNumber>' random active todos
    Then the selected todos should be completed
    Then the current value of the todos counter should be less than the previous value by '<todosNumber>'

    Examples:
      | todosNumber |
      | 1           |
      | 2           |
      | 9           |

  @MAT
  Scenario Outline: Check that the todos counter changes after todo is completed and afted todo is activated
    When complete '<todosNumber>' random active todos
    Then the selected todos should be completed
    And the current value of the todos counter should be less than the previous value by '<todosNumber>'
    When activate '<todosNumber>' random completed todos
    Then the selected todos should be active
    And the current value of the todos counter should be greater than the previous value by '<todosNumber>'

    Examples:
      | todosNumber |
      | 1           |
      | 2           |
      | 9           |
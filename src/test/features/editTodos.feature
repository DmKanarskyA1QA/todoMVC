@automated @editTodos
Feature: Tests for the 'edit todo' function

  Background: Open todoMVC page and add '10' random todos
    When open the todoMVC page
    Then the todoMVC page is displayed
    When add '3' random todos
    Then the active todos counter value should be igreater than 0
    And todo count is equal to the number of active todo items

  @MAT
  Scenario Outline: Check the ability to edit active todo
    When set the name of the random active todo as 'random'
    Then the selected item has been edited

  @MAT
  Scenario Outline: Check the ability to edit completed todo
    When complete '1' random active todos
    Then the selected todos should be completed
    When set the name of the random completed todo as 'random'
    Then the selected item has been edited

  @AT
  Scenario Outline: Make sure that if you set todo as an empty string, todo will be deleted
    When set the name of the random active todo as '    '
    Then the edited todo has been deleted
    And the current value of the todos counter should be less than the previous value by '1'

  @AT
  Scenario Outline: Make sure that if you set todo as a string of length 0, todo will be deleted
    When set the name of the random active todo as ''
    Then the edited todo has been deleted
    And the current value of the todos counter should be less than the previous value by '1'
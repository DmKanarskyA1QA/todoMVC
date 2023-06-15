@automated @addTodos
Feature: Tests for the 'add todo' function

  Background: Open todoMVC page
    When open the todoMVC page
    Then the todoMVC page is displayed

  @MAT
  Scenario Outline: Check the ability to create a single todo with a fixed name
    When add todo '<name>'
    Then the specified todos were added to the end of the list
    And todo count is equal to the number of active todo items

    Examples:
      | name                               |
      | a                                  |
      | Word                               |
      | Two words                          |
      | One two three                      |
      | 123456789                          |
      | ~`!@#$%^&*'()_+=-\\<\/>{.}[,]\";:? |

  @MAT
  Scenario Outline: Check the ability to create a single todo with a random name of length '<todoLength>'
    When add a random todo with length '<todoLength>'
    Then the specified todos were added to the end of the list
    And todo count is equal to the number of active todo items

    Examples:
      | todoLength |
      | 1          |
      | 2          |
      | 10         |
      | 100        |
      | 1000       |

  @MAT
  Scenario Outline: Check the ability to create a '<todosNumber>' random todo
    When add '<todosNumber>' random todos
    Then the specified todos were added to the end of the list
    And todo count is equal to the number of active todo items

    Examples:
      | todosNumber |
      | 1           |
      | 2           |
      | 10          |
      | 50          |

  @AT
  Scenario Outline: Check that the empty todo can't be added to the todo list
    When add todo '    '
    Then todo list is empty
    And todo count is not present on the page
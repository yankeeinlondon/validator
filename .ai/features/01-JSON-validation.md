# JSON Validation

- This is our first feature in a completely new project
- The goal of this project is to write code to `src/json` which will validate a string presented as being JSON content
  - the function `validateJaon()` will take a string input and return a boolean value indicating whether the passed in string was indeed a valid JSON definition
  - this validation function will then be used to create an MCP server and client exposing this simple functionality (we'll add more in future features)
  - the MCP server and client source files should be in `src/mcp` and all tests in `tests/mcp/*`
- all unit tests will be put into `tests/json` and use the Vitest test runner
- all exported functions in this repo should have at least one unit test and a function should not be presented to the user until the test has been written, run, and passed
- We should add a build script which will use `tsdown` to transpile the Typescript to Javascript
  - the target for the transpiled Javascript should be in the `/dist` folder

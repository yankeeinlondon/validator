# Refactoring 

Ok we need to refactor the code base a little in this feature implementation. The major things which have changed include:

- we have added a `src/.ai/best-practices.md` which provides an important overview of how this repo/project will be managed
- the big changes introduced by this document include:
  - where "types" should be defined
  - how error handling should be done
  - greater exlicitness on the "entry points" we will use to provide transpiled outputs from

As always, please start by reading and understanding the `src/.ai/best-practices.md` and then we will need to do the following work:

1. The validator code "should" have been updated with the ideas in the best practices but please verify (e.g., code in `src/validators/*`)
2. Make sure all tests are updated to follow our standards
3. Update the imports of purely type symbols to use the `import type ...` syntax
4. Update the MCP server's and clients in `src/mcp/*`
5. make sure that all the tests are passing



## Previous Featres

Features already implemented include: 

- [JSON Validation](./01-JSON-validation.md)
- [YAML Validation](./02-YAML-validation.md)

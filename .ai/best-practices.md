# Best Practices

## File Naming

- Entry points
  - for project's with a single "entry point" for the library code the convention of using a `src/index.ts` file should be maintained
  - this project will export the "library code" (aka, the validators) from `src/index.ts`
  - but this project also should export the MCP server and client's as a mapped export of `/mcp/server` and `/mcp/client` respectively
  - the "entry point" for the MCP server and client will be `src/server.ts` and `src/client.ts`
  - all entry point file's job should be _re-exporting_ the symbols needed for their focus area but not on any implementation code

- don't allow any one file to do too much
  - it's ok to have a file export more than one symbol but in general it's best that a file have one major purpose and one major symbol which is responsible. If that symbol needs some supporting symbols then that is fine.
- when to name files `index.ts`:
  - when a functional area requires more than one file to provide a clear and structured set of files then it's appropriate to create a directory and have an `index.ts` re-export all the files which are providing that functionality.
  - if there are three functional areas -- A, B, and C -- and both A and B fit comfortable into a file but C is much larger in scope and needs several files it's entirely to have:
    - `a.ts`
    - `b.ts`
    - `c/index.ts` and the necessary files
- Use descriptive filenames for validators (e.g., `json.ts`, `yaml.ts`) to avoid confusion when editing multiple files
- the golden rules for an `index.ts` file is ...does it just _re-export_ symbols and if the answer is yes then it's definitely a candidate for being a valid `index.ts`; in constrast if it's implementing functionality of it's own ... it should not be in the `index.ts` file!

## Types and Type Guards

Types are important and whereever we can have an accurate (or narrow type which is appropriate) then we should do this. Furthermore, types _in general_ should be found in the `src/types/*.ts` directory. This helps keep the implementation code nice and clean and separate from the types but it also tends to lead to better practice of using the "type" syntax in `import type { x, y, z } from "somewhere"` so that the transpiler is fully clear that all imports are purely type based.

The `interface` and `type` constructs in Typescript overlap quite a bit but we prefer the use of `type` except in cases where the structure being defined benefits from a caller of the library having an easy way of _extending_ the interface afterward.

All _type guards_ (aka, runtime functions which can help narrow a type based on a boolean logic) should all be located in the `src/type-guards` directory.

## Import/Export Patterns

- **Prefer named exports** over default exports unless there's a compelling reason
- Use named imports to make dependencies explicit: `import { validateYaml } from "~/validators/yaml"`
- Organize related functions, types, and interfaces in the same file when they serve the same validation purpose
- Export types and interfaces that consumers might need: `export interface YamlValidationResult`

## Validators

- all source code in `src/validators/**/*.ts` should be supporting the core validator functionality
- The goal of a validator is to _validate_ that an input is a valid form of some known type.
- Validators will always return a `Result`:
  - a `Result` is the union of the `Validated` and `Invalid` types
  - A `Validated<T>` type can be tested for using the `isValid()` type guard
    - the base return of a `Validated` type is just a `message`, the parsed `data`, and 



## MCP

- all validators should be made available as both an MCP server and client
- all MCP clients and servers must support both the STDIN/STDOUT method of interaction as well as the HTTP method with SSE
- testing needs to cover the MCP communication between client and server using both interaction methods

## Testing 

- all unit tests will use the `Vitest` test runner
- all validator functions as well as MCP functions need to have a corresponding test
- the tests should all be in the `tests/` folder and be in the same subdirectory as the corresponding implementation code resides in. 
  - e.g., a function `doSomething()` in the `/src/validators` would have test called `/tests/validators/doSomething.test.ts`
- **Test Coverage Requirements:**
  - Test both valid and invalid inputs with a variety of edge cases
  - Include tests for error conditions and error message content when relevant
  - For validators with schema support, test both with and without schemas
  - Test type safety and interface contracts
- **Test Organization:**
  - Group related tests using `describe()` blocks 
  - Use descriptive test names that explain the expected behavior
  - Test files should mirror the structure of source files

## Documentation

- All exported functions should include JSDoc comments with `@param` and `@returns` annotations
- Use TypeScript interfaces to define clear contracts for function parameters and return values
- Update README.md with usage examples when adding new validators
- Update CLAUDE.md with development guidance for new patterns or conventions
- Include schema examples in documentation for validators that support schema validation



## Error Handling

### Kind Errors

- All errors thrown in this library need to be explicitly defined.
- We will use the `@yankeeinlondon/kind-error` to define error types in the `src/errors.ts` file
- These error types can be instantiated like so:

    ```ts
    import { UnknownError } from "~/errors";

    const err = UnknownError(`Uh oh, something bad happened`, { foo, bar })
    ```

    > The first parameter is the error message, then you can add any other key/value pairs to add context to the error

- All error types can also _proxy_ an existing error:

    ```ts
    import { UnknownError } from "~/errors";

    try {
        // do some stuff
    } catch (err) {
        throw UnknownError.proxy(err);
    }
    ```

  - A proxied error produces a useful message benefiting from the _underlying_ error's message.
  - The proxy error will have a `underlying` property which contains the proxied error to ensure no loss is encurred.
  - New errors in `src/errors.ts` can be added as needed

### Ok, Fail, and Result

- the `Success` and `Fail` types have been defined in the file `src/types/general.ts` and will allow us to express more information than a simple binary operator can in validation results
- the `Result` type is just a union between the `Ok` and `Fail` states
- errors are _thrown_ in some cases but in the case of a successful validation which resulted in the test being `false` we will _return_ (not throw) the `FailedValidation` as part of the `Failure` type.
- this allows to provide useful metadata on the error object itself and the caller can decide to either handle the error condition or opt to throw it if they like.
- finally, there is a `isOk()` type guard to validate a `Result` is a `Success`

### Other Error Handling Principles

- Use consistent error handling patterns across validators
- Return meaningful error messages that help users understand what went wrong
- For structural validation failures, include enough context to identify the problem
- For schema validation failures, leverage the underlying library's error messaging (e.g., AJV's `errorsText()`)
- Prefer returning error information in result objects rather than throwing exceptions for validation failures

## Dependencies

- **Validation Libraries:** Use well-established libraries for complex validation (e.g., `ajv` for JSON Schema, `yaml` for YAML parsing)
- **MCP Integration:** Always use the official `@modelcontextprotocol/sdk` for MCP functionality
- **Testing:** Stick to Vitest for consistency across the project
- Keep dependencies minimal and avoid adding libraries for functionality that can be implemented simply

## Validation Function Patterns

- **Simple validators** (like JSON): Return boolean for basic structural validation
- **Complex validators** (like YAML): Return detailed result objects with multiple validation aspects
- **Schema validators**: Support optional schema parameter and return schema validation results separately from structural validation
- **Auto-detection**: Provide utilities to extract schema references from content when applicable
- Always separate structural validation from schema validation logic

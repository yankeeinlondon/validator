# YAML Validation

- in our second feature we'll use the npm library `yaml` to load in YAML files and validate them in two ways:

    1. Structural Validity - we need to ensure that the yaml is structurally valid 
    2. Schematical Validity - if the YAML refers to a schema which is the document is intended to be validated by then we'll check that validation too.

- make sure to create an exportable CJS and ESM export 
- and like with the first feature we'll then wrap this function as a MCP client and server
- be sure that the MCP server and client supports both STDIN/STDOUT and HTTP via SSE
- all functions need complete testing (using the Vitest test runner)

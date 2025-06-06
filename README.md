# Validator

A TypeScript validation library with Model Context Protocol (MCP) integration, designed to provide comprehensive data validation capabilities through both programmatic APIs and MCP server/client interfaces.

## Features

### Current Validators

- **JSON Validation**: Validate JSON string format using `validateJaon()`
- **YAML Validation**: Comprehensive YAML validation with structural and schema validation

### Transport Options

The validator can be accessed through multiple transport mechanisms:

- **STDIN/STDOUT**: Traditional command-line interface for MCP integration
- **HTTP with SSE**: Web-based Server-Sent Events for browser and HTTP client integration

## Installation

```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build
```

## Quick Start

### Direct API Usage

#### JSON Validation

```typescript
import { validateJaon } from "./dist/validators/json.mjs";

const isValid = validateJaon('{"name": "John", "age": 30}');
console.log(isValid); // true

const isInvalid = validateJaon('{invalid json}');
console.log(isInvalid); // false
```

#### YAML Validation

```typescript
import { 
  validateYamlStructure, 
  validateYaml, 
  validateYamlWithSchemaDetection 
} from "./dist/validators/yaml.mjs";

// Basic structural validation
const isStructurallyValid = validateYamlStructure(`
name: John
age: 30
`);
console.log(isStructurallyValid); // true

// Validation with JSON schema
const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "number", minimum: 0 }
  },
  required: ["name", "age"]
};

const result = validateYaml(`
name: John
age: 30
`, { schema });

console.log(result.structurallyValid); // true
console.log(result.schemaValid); // true

// Auto-detection from schema reference in YAML
const yamlWithSchema = `
$schema: "person-schema"
name: John
age: 30
`;

const schemaRegistry = {
  "person-schema": schema
};

const autoResult = validateYamlWithSchemaDetection(yamlWithSchema, schemaRegistry);
console.log(autoResult.schemaValid); // true
```

### MCP Client Usage

#### STDIN/STDOUT Transport

```typescript
import { ValidatorClient } from "./dist/mcp/client.mjs";

const client = new ValidatorClient({
  transport: "stdio",
  command: "node",
  args: ["dist/mcp/server.mjs"]
});

await client.connect();

// JSON validation
const jsonResult = await client.validateJson('{"test": true}');
console.log(jsonResult); // { valid: true, input: '{"test": true}' }

// YAML structural validation
const yamlStructureResult = await client.validateYamlStructure(`
name: John
age: 30
`);
console.log(yamlStructureResult); // { structurallyValid: true, input: "..." }

// YAML with schema validation
const yamlResult = await client.validateYaml(`
name: John
age: 30
`, {
  schema: {
    type: "object",
    properties: {
      name: { type: "string" },
      age: { type: "number" }
    },
    required: ["name", "age"]
  }
});
console.log(yamlResult.schemaValid); // true

// YAML with auto schema detection
const autoResult = await client.validateYamlWithSchemaDetection(`
$schema: "person-schema"
name: John
age: 30
`, {
  "person-schema": {
    type: "object",
    properties: {
      name: { type: "string" },
      age: { type: "number" }
    }
  }
});

await client.disconnect();
```

#### HTTP with SSE Transport

```typescript
import { ValidatorClient } from "./dist/mcp/client.mjs";

const client = new ValidatorClient({
  transport: "sse",
  url: "http://localhost:3000/mcp"
});

await client.connect();

// Same API as STDIO transport
const result = await client.validateJson('{"test": true}');
const yamlResult = await client.validateYamlStructure('name: value');

await client.disconnect();
```

## Running the Servers

### STDIN/STDOUT MCP Server

```bash
pnpm run start:stdio
```

### HTTP MCP Server with SSE

```bash
pnpm run start:http
```

The HTTP server provides the following endpoints:

- `GET http://localhost:3000/mcp` - Establish SSE connection
- `POST http://localhost:3000/mcp/message` - Send messages to server
- `GET http://localhost:3000/health` - Health check endpoint

## Development

### Commands

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Type checking
pnpm run typecheck

# Linting
pnpm run lint

# Build project
pnpm run build
```

### Project Structure

```
src/
├── validators/     # All validation functionality
│   ├── json.ts     # JSON validation (validateJaon)
│   └── yaml.ts     # YAML validation (validateYaml*, extractYamlSchemaReference)
├── mcp/            # MCP server and client implementations
│   ├── server.ts   # STDIN/STDOUT MCP server
│   ├── http-server.ts # HTTP MCP server with SSE
│   ├── client.ts   # Universal MCP client
│   └── example.ts  # Usage examples
tests/
├── json/           # JSON validation tests
├── yaml/           # YAML validation tests
└── mcp/            # MCP integration tests
```

## Future Validators

This library is designed for extensibility. Future validation types will be added as separate modules:

- **Email Validation**: Validate email address formats
- **URL Validation**: Validate URL structures and protocols
- **Schema Validation**: Validate data against JSON schemas
- **Date Validation**: Validate date formats and ranges
- **Custom Validation**: Support for user-defined validation rules

Each validator will follow the same pattern:
- Direct API in `src/validators/{validator-type}.ts` with named exports
- MCP integration through existing server/client infrastructure
- Comprehensive test coverage in `tests/{validator-type}/`

## Contributing

1. Install dependencies: `pnpm install`
2. Make your changes
3. Run tests: `pnpm test`
4. Run type checking: `pnpm run typecheck`
5. Run linting: `pnpm run lint`
6. Build: `pnpm run build`

## License

ISC
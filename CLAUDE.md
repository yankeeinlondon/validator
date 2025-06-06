# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: This project uses `pnpm`

**Linting**:

```bash
pnpm exec eslint .
```

**Type Checking**:

```bash
pnpm exec tsc --noEmit
```

**Testing**:

```bash
pnpm exec vitest
# For watch mode during development:
pnpm exec vitest --watch
# For single test run:
pnpm exec vitest run
```

**Build Validation** (run both linting and type checking):

```bash
pnpm exec eslint . && pnpm exec tsc --noEmit
```

## Project Architecture

This is a TypeScript library project named "validator" currently in initial setup phase. The codebase is empty but fully configured with modern tooling.

**Module System**: ES Modules with TypeScript, targeting ES2022
**Path Mapping**: `~/*` maps to `src/*` for clean imports
**Project Type**: Library (not an application)

### Directory Structure

- `src/validators/` - All validation functions (json.ts, yaml.ts)
- `src/mcp/` - MCP server and client implementations  
- `tests/` - Test files using Vitest with matching structure

### Code Style & Linting

- Uses @antfu/eslint-config with library preset
- Double quotes for strings, semicolons required
- Specific overrides for TypeScript warnings on unused variables with `_` prefix
- Formatters enabled for consistent code style

### Testing Setup

- Vitest configured with alias mapping
- Path resolution matches TypeScript configuration
- No specific test patterns defined yet

### CI/CD

- GitHub Actions configured for automated testing and NPM publishing
- Publishes automatically on commit messages containing "release v"
- Husky pre-push hooks for validation

## Current Features

### JSON Validation

- `validateJaon()` function in `src/json/` validates JSON strings
- Comprehensive unit tests with edge cases
- MCP server and client implementation with dual transport support

### YAML Validation

- `validateYamlStructure()` for basic structural validation
- `validateYaml()` for structural and JSON schema validation
- `validateYamlWithSchemaDetection()` for automatic schema detection from YAML content
- `extractYamlSchemaReference()` utility for schema reference extraction
- Supports JSON Schema validation using AJV
- Comprehensive test coverage with various edge cases

### MCP Integration

- **STDIO Transport**: Traditional stdin/stdout communication
  - Start with: `npm run start:stdio`
  - Use with: `new JsonValidatorClient({ transport: "stdio" })`
- **HTTP with SSE Transport**: Server-Sent Events over HTTP
  - Start with: `npm run start:http` (port 3000)
  - Use with: `new JsonValidatorClient({ transport: "sse", url: "http://localhost:3000/mcp" })`
- Example usage in `src/mcp/example.ts`

### Available Commands

```bash
# Start servers
npm run start:stdio    # STDIO-based MCP server
npm run start:http     # HTTP-based MCP server with SSE

# Example client usage
node dist/mcp/example.mjs
```

## Development Guidelines

**File Naming Convention**: Validators use descriptive filenames (e.g., `json.ts`, `yaml.ts`) rather than `index.ts` to avoid confusion when editing multiple files. All exports are named exports unless there's a compelling reason for default exports.

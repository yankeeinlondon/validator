import process from "node:process";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { validateJson } from "~/validators/json";
import { validateYaml, validateYamlStructure, validateYamlWithSchemaDetection } from "~/validators/yaml";

const server = new Server(
  {
    name: "validator",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "validate_json",
        description: "Validate if a string is valid JSON",
        inputSchema: {
          type: "object",
          properties: {
            input: {
              type: "string",
              description: "The string to validate as JSON",
            },
          },
          required: ["input"],
        },
      },
      {
        name: "validate_yaml_structure",
        description: "Validate if a string is structurally valid YAML",
        inputSchema: {
          type: "object",
          properties: {
            input: {
              type: "string",
              description: "The YAML string to validate structurally",
            },
          },
          required: ["input"],
        },
      },
      {
        name: "validate_yaml",
        description: "Validate YAML structure and optionally against a JSON schema",
        inputSchema: {
          type: "object",
          properties: {
            input: {
              type: "string",
              description: "The YAML string to validate",
            },
            schema: {
              type: "object",
              description: "Optional JSON schema to validate against",
            },
            strict: {
              type: "boolean",
              description: "Use strict mode for schema validation",
              default: false,
            },
          },
          required: ["input"],
        },
      },
      {
        name: "validate_yaml_with_schema_detection",
        description: "Validate YAML with automatic schema detection from content",
        inputSchema: {
          type: "object",
          properties: {
            input: {
              type: "string",
              description: "The YAML string to validate",
            },
            schemaRegistry: {
              type: "object",
              description: "Registry of schemas by URL/ID for schema detection",
              default: {},
            },
          },
          required: ["input"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "validate_json") {
    const { input } = args as { input: string };
    const result = validateJson(input);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            valid: result.success,
            input,
            result,
          }),
        },
      ],
    };
  }

  if (name === "validate_yaml_structure") {
    const { input } = args as { input: string };
    const isValid = validateYamlStructure(input);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            structurallyValid: isValid,
            input,
          }),
        },
      ],
    };
  }

  if (name === "validate_yaml") {
    const { input, schema, strict } = args as {
      input: string;
      schema?: object;
      strict?: boolean;
    };
    const result = validateYaml(input, { schema, strict });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
    };
  }

  if (name === "validate_yaml_with_schema_detection") {
    const { input, schemaRegistry } = args as {
      input: string;
      schemaRegistry?: Record<string, object>;
    };
    const result = validateYamlWithSchemaDetection(input, schemaRegistry || {});

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { server };

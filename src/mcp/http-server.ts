import type { IncomingMessage, ServerResponse } from "node:http";
import { createServer } from "node:http";
import process from "node:process";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { UnknownTool } from "~/errors";
import { validateJson } from "~/validators/json";
import { validateYaml } from "~/validators/yaml";

const mcpServer = new Server(
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

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
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

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
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

  throw UnknownTool(`The tool '${name}' is not recognized by the Validator MCP server!`);
});

const activeTransports = new Map<string, SSEServerTransport>();

function parseRequestBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      }
      catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.writeHead(200);
    res.end();
    return;
  }

  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (url.pathname === "/mcp") {
    if (req.method === "GET") {
      // Initialize SSE connection
      const transport = new SSEServerTransport("/mcp/message", res);
      activeTransports.set(transport.sessionId, transport);

      transport.onclose = () => {
        activeTransports.delete(transport.sessionId);
      };

      await mcpServer.connect(transport);
      await transport.start();
    }
    else {
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("Method Not Allowed");
    }
  }
  else if (url.pathname === "/mcp/message") {
    if (req.method === "POST") {
      try {
        const body = await parseRequestBody(req);
        const sessionId = url.searchParams.get("sessionId");

        if (!sessionId) {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Missing sessionId parameter");
          return;
        }

        const transport = activeTransports.get(sessionId);
        if (!transport) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Session not found");
          return;
        }

        await transport.handlePostMessage(req, res, body);
      }
      catch {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Bad Request");
      }
    }
    else {
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("Method Not Allowed");
    }
  }
  else if (url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", activeConnections: activeTransports.size }));
  }
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const PORT = process.env.PORT || 3000;

export function startHttpServer(): Promise<void> {
  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.warn(`MCP HTTP server listening on port ${PORT}`);
      console.warn(`SSE endpoint: http://localhost:${PORT}/mcp`);
      console.warn(`Message endpoint: http://localhost:${PORT}/mcp/message`);
      console.warn(`Health check: http://localhost:${PORT}/health`);
      resolve();
    });
  });
}

export function stopHttpServer(): Promise<void> {
  return new Promise((resolve) => {
    server.close(() => {
      resolve();
    });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startHttpServer().catch(console.error);
}

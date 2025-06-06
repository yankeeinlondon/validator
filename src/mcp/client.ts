import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

export type TransportType = "stdio" | "sse";

export interface ValidatorClientOptions {
  transport?: TransportType;
  url?: string;
  command?: string;
  args?: string[];
}

export class ValidatorClient {
  private client: Client;
  private transport: StdioClientTransport | SSEClientTransport;

  constructor(options: ValidatorClientOptions = {}) {
    this.client = new Client(
      {
        name: "validator-client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      },
    );

    const transportType = options.transport || "stdio";

    if (transportType === "sse") {
      if (!options.url) {
        throw new Error("URL is required for SSE transport");
      }
      this.transport = new SSEClientTransport(new URL(options.url));
    }
    else {
      this.transport = new StdioClientTransport({
        command: options.command || "node",
        args: options.args || ["dist/mcp/server.mjs"],
      });
    }
  }

  async connect(): Promise<void> {
    await this.client.connect(this.transport);
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async validateJson(input: string): Promise<{ valid: boolean; input: string }> {
    const result = await this.client.request(
      {
        method: "tools/call",
        params: {
          name: "validate_json",
          arguments: { input },
        },
      },
      CallToolRequestSchema,
    ) as any;

    if (result.content?.[0]?.type === "text") {
      return JSON.parse(result.content[0].text);
    }

    throw new Error("Invalid response from server");
  }

  async validateYamlStructure(input: string): Promise<{ structurallyValid: boolean; input: string }> {
    const result = await this.client.request(
      {
        method: "tools/call",
        params: {
          name: "validate_yaml_structure",
          arguments: { input },
        },
      },
      CallToolRequestSchema,
    ) as any;

    if (result.content?.[0]?.type === "text") {
      return JSON.parse(result.content[0].text);
    }

    throw new Error("Invalid response from server");
  }

  async validateYaml(
    input: string,
    options: { schema?: object; strict?: boolean } = {},
  ): Promise<any> {
    const result = await this.client.request(
      {
        method: "tools/call",
        params: {
          name: "validate_yaml",
          arguments: { input, ...options },
        },
      },
      CallToolRequestSchema,
    ) as any;

    if (result.content?.[0]?.type === "text") {
      return JSON.parse(result.content[0].text);
    }

    throw new Error("Invalid response from server");
  }

  async validateYamlWithSchemaDetection(
    input: string,
    schemaRegistry: Record<string, object> = {},
  ): Promise<any> {
    const result = await this.client.request(
      {
        method: "tools/call",
        params: {
          name: "validate_yaml_with_schema_detection",
          arguments: { input, schemaRegistry },
        },
      },
      CallToolRequestSchema,
    ) as any;

    if (result.content?.[0]?.type === "text") {
      return JSON.parse(result.content[0].text);
    }

    throw new Error("Invalid response from server");
  }

  async listTools(): Promise<any> {
    return await this.client.request(
      {
        method: "tools/list",
        params: {},
      },
      ListToolsRequestSchema,
    );
  }
}

// Keep the old name for backward compatibility
export const JsonValidatorClient = ValidatorClient;

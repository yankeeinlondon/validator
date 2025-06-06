import process from "node:process";
import { JsonValidatorClient } from "./client.js";

// Example usage of both transport types

async function exampleStdioClient() {
  console.warn("=== STDIO Transport Example ===");

  const client = new JsonValidatorClient({
    transport: "stdio",
    command: "node",
    args: ["dist/mcp/server.mjs"],
  });

  try {
    await client.connect();

    const tools = await client.listTools();
    console.warn("Available tools:", tools.tools);

    const result1 = await client.validateJson("{\"valid\": \"json\"}");
    console.warn("Valid JSON result:", result1);

    const result2 = await client.validateJson("{invalid json}");
    console.warn("Invalid JSON result:", result2);

    await client.disconnect();
  }
  catch (error) {
    console.error("STDIO client error:", error);
  }
}

async function exampleSseClient() {
  console.warn("=== SSE Transport Example ===");

  const client = new JsonValidatorClient({
    transport: "sse",
    url: "http://localhost:3000/mcp",
  });

  try {
    await client.connect();

    const tools = await client.listTools();
    console.warn("Available tools:", tools.tools);

    const result1 = await client.validateJson("{\"valid\": \"json\"}");
    console.warn("Valid JSON result:", result1);

    const result2 = await client.validateJson("{invalid json}");
    console.warn("Invalid JSON result:", result2);

    await client.disconnect();
  }
  catch (error) {
    console.error("SSE client error:", error);
  }
}

// Run examples
async function main() {
  console.warn("MCP Client Examples");
  console.warn("==================");

  // Note: For STDIO example, make sure the server is built first with `npm run build`
  // Note: For SSE example, start the HTTP server first with `npm run start:http`

  await exampleStdioClient();
  console.warn("");
  await exampleSseClient();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

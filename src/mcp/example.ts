import process from "node:process";
import { JsonValidatorClient } from "./client.js";

// Example usage of both transport types

async function exampleStdioClient() {
  console.log("=== STDIO Transport Example ===");

  const client = new JsonValidatorClient({
    transport: "stdio",
    command: "node",
    args: ["dist/mcp/server.mjs"],
  });

  try {
    await client.connect();

    const tools = await client.listTools();
    console.log("Available tools:", tools.tools);

    const result1 = await client.validateJson("{\"valid\": \"json\"}");
    console.log("Valid JSON result:", result1);

    const result2 = await client.validateJson("{invalid json}");
    console.log("Invalid JSON result:", result2);

    await client.disconnect();
  }
  catch (error) {
    console.error("STDIO client error:", error);
  }
}

async function exampleSseClient() {
  console.log("=== SSE Transport Example ===");

  const client = new JsonValidatorClient({
    transport: "sse",
    url: "http://localhost:3000/mcp",
  });

  try {
    await client.connect();

    const tools = await client.listTools();
    console.log("Available tools:", tools.tools);

    const result1 = await client.validateJson("{\"valid\": \"json\"}");
    console.log("Valid JSON result:", result1);

    const result2 = await client.validateJson("{invalid json}");
    console.log("Invalid JSON result:", result2);

    await client.disconnect();
  }
  catch (error) {
    console.error("SSE client error:", error);
  }
}

// Run examples
async function main() {
  console.log("MCP Client Examples");
  console.log("==================");

  // Note: For STDIO example, make sure the server is built first with `npm run build`
  // Note: For SSE example, start the HTTP server first with `npm run start:http`

  await exampleStdioClient();
  console.log();
  await exampleSseClient();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

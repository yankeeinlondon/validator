import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { describe, expect, it } from "vitest";
import { server } from "~/mcp/server";

describe("MCP Server", () => {
  it("should be an instance of Server", () => {
    expect(server).toBeInstanceOf(Server);
  });

  it("should export server correctly", () => {
    expect(server).toBeDefined();
    expect(typeof server).toBe("object");
  });
});

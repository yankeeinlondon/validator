import { describe, expect, it } from "vitest";
import { startHttpServer, stopHttpServer } from "~/mcp/http-server";

describe("MCP HTTP Server", () => {
  it("should have startHttpServer function", () => {
    expect(typeof startHttpServer).toBe("function");
  });

  it("should have stopHttpServer function", () => {
    expect(typeof stopHttpServer).toBe("function");
  });
});

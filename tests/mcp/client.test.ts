import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JsonValidatorClient, ValidatorClient } from "~/mcp/client";

describe("ValidatorClient", () => {
  let client: ValidatorClient;

  beforeEach(() => {
    client = new ValidatorClient({ transport: "stdio" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create client instance", () => {
    expect(client).toBeInstanceOf(ValidatorClient);
  });

  it("should have connect method", () => {
    expect(typeof client.connect).toBe("function");
  });

  it("should have disconnect method", () => {
    expect(typeof client.disconnect).toBe("function");
  });

  it("should have validateJson method", () => {
    expect(typeof client.validateJson).toBe("function"); 
  });

  it("should have validateYamlStructure method", () => {
    expect(typeof client.validateYamlStructure).toBe("function");
  });

  it("should have validateYaml method", () => {
    expect(typeof client.validateYaml).toBe("function");
  });

  it("should have validateYamlWithSchemaDetection method", () => {
    expect(typeof client.validateYamlWithSchemaDetection).toBe("function");
  });

  it("should have listTools method", () => {
    expect(typeof client.listTools).toBe("function");
  });

  it("should create client with STDIO transport by default", () => {
    const defaultClient = new ValidatorClient();
    expect(defaultClient).toBeInstanceOf(ValidatorClient);
  });

  it("should create client with STDIO transport explicitly", () => {
    const stdioClient = new ValidatorClient({ transport: "stdio" });
    expect(stdioClient).toBeInstanceOf(ValidatorClient);
  });

  it("should create client with SSE transport", () => {
    const sseClient = new ValidatorClient({
      transport: "sse",
      url: "http://localhost:3000/mcp",
    });
    expect(sseClient).toBeInstanceOf(ValidatorClient);
  });

  it("should throw error when SSE transport is used without URL", () => {
    expect(() => {
      const _client = new ValidatorClient({ transport: "sse" });
    }).toThrow("URL is required for SSE transport");
  });

  it("should maintain backward compatibility with JsonValidatorClient", () => {
    const legacyClient = new JsonValidatorClient({ transport: "stdio" });
    expect(legacyClient).toBeInstanceOf(ValidatorClient);
    expect(typeof legacyClient.validateJson).toBe("function");
  });
});

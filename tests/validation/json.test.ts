import { describe, expect, it } from "vitest";
import { validateJson } from "~/validators/json";
import { isValid } from "~/type-guards";
import type { Result } from "~/types";

describe("validateJson", () => {
  it("should return success for valid JSON strings", () => {
    const tests = ["{}","[]","\"hello\"","123","true","false","null","{\"name\": \"John\", \"age\": 30}","[1, 2, 3]"];
    
    tests.forEach(test => {
      const result = validateJson(test);
      expect(result.success).toBe(true);
      if (isValid(result)) {
        expect(result.message).toBe("Valid JSON string");
      }
    });
  });

  it("should return failure for invalid JSON strings", () => {
    const tests = ["{","}","[","]","{\"name\": \"John\",}","undefined","hello","{name: 'John'}",""];
    
    tests.forEach(test => {
      const result = validateJson(test);
      expect(result.success).toBe(false);
      if (!isValid(result)) {
        expect(result.error).toBeDefined();
      }
    });
  });

  it("should handle edge cases", () => {
    const invalidTests = [" ", "\n", "\t", "[null, undefined]"];
    const validTests = ["{\"a\": 1, \"b\": 2}"];

    invalidTests.forEach(test => {
      const result = validateJson(test);
      expect(result.success).toBe(false);
    });

    validTests.forEach(test => {
      const result = validateJson(test);
      expect(result.success).toBe(true);
    });
  });
});

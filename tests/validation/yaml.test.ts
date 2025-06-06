import { describe, it, expect, vi } from "vitest";
import { validateYaml } from "~/validators/yaml";
import { isValid } from "~/type-guards";
import { Schema } from "ajv";

const validYaml = `foo: bar\nbaz: 123`;
const invalidYaml = `foo: bar\nbaz 123`;
const validSchema: Schema = {
    type: "object",
    properties: {
        foo: { type: "string" },
        baz: { type: "number" },
    },
    required: ["foo", "baz"],
    additionalProperties: false,
};
const incompatibleSchema: Schema = {
    type: "object",
    properties: {
        foo: { type: "number" }, // should be string
        baz: { type: "string" }, // should be number
    },
    required: ["foo", "baz"],
    additionalProperties: false,
};

// This is a truly invalid schema
const invalidSchema = {
    type: "not-a-valid-type",
    properties: {
        foo: { type: "string" },
    },
};

describe("validateYaml", () => {
    it("returns success for valid YAML with no schema", async () => {
        const result = await validateYaml(validYaml);
        expect(isValid(result)).toBe(true);
        if (isValid(result)) {
            expect(result.success).toBe(true);
            expect(result.data).toEqual({ foo: "bar", baz: 123 });
        }
    });

    it("returns error for invalid YAML", async () => {
        const result = await validateYaml(invalidYaml);
        expect(isValid(result)).toBe(false);
        if (!isValid(result)) {
            expect(result.error).toBeDefined();
        }
    });

    it("validates YAML against a provided valid schema", async () => {
        const result = await validateYaml(validYaml, { schema: validSchema });
        expect(isValid(result)).toBe(true);
        if (isValid(result)) {
            expect(result.success).toBe(true);
            expect(result.data).toEqual({ foo: "bar", baz: 123 });
        }
    });

    it("returns error for YAML that fails provided incompatible schema", async () => {
        const result = await validateYaml(
            validYaml, 
            { schema: incompatibleSchema }
        );
        expect(isValid(result)).toBe(false);
        if (!isValid(result)) {
            expect(result.error).toBeDefined();
        }
    });

    it("returns error for truly invalid schema", async () => {
        const result = await validateYaml(validYaml, { schema: invalidSchema });
        expect(isValid(result)).toBe(false);
        if (!isValid(result)) {
            expect(result.error).toBeDefined();
        }
    });
});

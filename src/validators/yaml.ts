import type { Schema } from "ajv";
import type { Result } from "~/types/general";
import type { YamlValidationOptions } from "~/types/yaml";
import fs from "node:fs/promises";
import { URL } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { isObject, isString } from "inferred-types";
import { parse as parseYaml } from "yaml";
import { FailedValidation, InvalidSchema, UnexpectedError } from "~/errors";

/**
 * Extracts schema reference from YAML content.
 * Looks for common schema reference patterns like $schema, schema, x-schema, _schema.
 */
function extractYamlSchemaReference(doc: Record<string, any>): string | null {
  const schemaFields = ["$schema", "schema", "x-schema", "_schema"];
  for (const field of schemaFields) {
    if (field in doc && isString(doc[field])) {
      return doc[field];
    }
  }
  return null;
}

/**
 * Loads a schema from a URI or file path.
 * Supports HTTP(S) URLs and local file paths.
 */
async function loadSchema(schemaRef: string): Promise<Schema | null> {
  try {
    // Check if schemaRef is a valid URL
    let url: URL | null = null;
    try {
      url = new URL(schemaRef);
    }
    catch {
      url = null;
    }
    if (url && (url.protocol === "http:" || url.protocol === "https:")) {
      // HTTP(S) URL: fetch the schema
      const res = await fetch(schemaRef);
      if (!res.ok)
        return null;
      return await res.json();
    }
    else {
      // Local file path: read and parse as JSON
      const fileContent = await fs.readFile(schemaRef, "utf-8");
      return JSON.parse(fileContent);
    }
  }
  catch (err) {
    throw InvalidSchema.proxy(err);
  }
}

/**
 * Validates YAML at two levels:
 * 1. Is this a valid YAML structure?
 * 2. If a schema is referenced or provided, does the YAML conform to it?
 */
export async function validateYaml(
  input: string,
  options: YamlValidationOptions = {},
): Promise<Result> {
  try {
    // 1. Parse YAML
    let data: unknown;
    try {
      data = parseYaml(input);
    }
    catch (err) {
      return {
        success: false,
        error: FailedValidation.proxy(err),
      };
    }

    // 2. Determine schema to use
    let schema: Schema | null = null;
    if (options.schema) {
      schema = options.schema;
    }
    else if (isObject(data)) {
      const schemaRef = extractYamlSchemaReference(data);
      if (schemaRef) {
        schema = await loadSchema(schemaRef);
        if (!schema) {
          return {
            success: false,
            error: FailedValidation(
              `Schema reference "${schemaRef}" could not be resolved.`,
            ),
          };
        }
      }
    }

    // 3. Validate against schema if available
    if (schema) {
      const ajv = new Ajv({ strict: options.strict ?? false });
      addFormats(ajv);
      const validate = ajv.compile(schema);
      const schemaValid = validate(data);

      if (!schemaValid) {
        return {
          success: false,
          error: FailedValidation(
            "YAML failed schema validation",
            { errors: ajv.errorsText(validate.errors) },
          ),
        };
      }

      return {
        success: true,
        message: "Valid YAML with valid schema",
        data,
        schemaRef: schema,
      };
    }

    // 4. No schema to validate against
    return {
      success: true,
      message: "Valid YAML structure, no schema to validate against",
      data,
    };
  }
  catch (err) {
    return {
      success: false,
      error: UnexpectedError.proxy(err),
    };
  }
}

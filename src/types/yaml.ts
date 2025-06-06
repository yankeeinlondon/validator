import type { Schema } from "ajv";

export interface YamlValidationOptions {
  schema?: object;
  strict?: boolean;
}

export interface YamlValidation {
  /** the schema which the YAML was validated against */
  schemaRef?: string | Schema;
}

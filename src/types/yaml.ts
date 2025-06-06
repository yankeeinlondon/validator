import { Schema } from "ajv";

export type YamlValidationOptions = {
  schema?: object;
  strict?: boolean;
};


export type YamlValidation = {
  /** the schema which the YAML was validated against */
  schemaRef?: string | Schema;
};

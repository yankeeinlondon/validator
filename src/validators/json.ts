import type { Dictionary, Scalar } from "inferred-types";
import type { Result } from "~/types";
import { isArray, isBoolean, isNumber, isObject, isString } from "inferred-types";
import { FailedValidation } from "~/errors";

export interface JsonResp {
  data: Scalar | Dictionary | Array<any>;
  typeToken: string;
}

/**
 * Validates if a string is valid JSON
 * @param input - The string to validate as JSON
 * @returns Result indicating success or failure with details
 */
export function validateJson(input: string): Result<JsonResp> {
  try {
    const parsed = JSON.parse(input);
    const typeToken = isObject(parsed)
      ? "object"
      : isArray(parsed)
        ? "array"
        : isBoolean(parsed)
          ? "boolean"
          : isNumber(parsed)
            ? "number"
            : isString(parsed)
              ? "string"
              : "scalar";

    const message = isObject(parsed)
      ? "Is a valid JSON object"
      : isArray(parsed)
        ? "Is a valid JSON array"
        : isBoolean(parsed)
          ? "Is a valid JSON boolean"
          : isNumber(parsed)
            ? "is a valid JSON number"
            : isString(parsed)
              ? "is a valid JSON string"
              : "is valid JSON";

    return {
      success: true,
      message,
      data: parsed,
      typeToken,
    };
  }
  catch (err) {
    return {
      success: false,
      error: FailedValidation.proxy(err),
    };
  }
}

import { FailedValidation } from "~/errors";
import type { Result } from "~/types";

/**
 * Validates if a string is valid JSON
 * @param input - The string to validate as JSON
 * @returns Result indicating success or failure with details
 */
export function validateJson(input: string): Result {
  try {
    const parsed = JSON.parse(input);
    return {
      success: true,
      message: "Valid JSON string",
      data: parsed,
    };
  }
  catch (err) {
    return {
      success: false,
      error: FailedValidation("Invalid JSON format"),
    };
  }
}


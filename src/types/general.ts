import type { EmptyObject } from "inferred-types";
import type { FailedValidation } from "~/errors";

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * Represents a successful validation result
 */
export type Valid<
  TExtend extends Record<string, unknown> = EmptyObject,
  TData = unknown,
> = {
  /** boolean flag indicating that the validation was a success */
  success: true;
  /** a textual message describing the success */
  message: string;
  /** The parsed data used for analysis of the input */
  data: TData;
} & TExtend;

/**
 * Represents a failed validation result
 */
export interface Invalid {
  /** boolean flag indicating that the validation failed */
  success: false;
  /**
   * An instance of the `FailedValidation` error.
   *
   * - structured data will often be included in the error
   *
   *   ```ts
   *   return FailedValidation(message, { foo, bar, etc })
   *   ```
   */
  error: typeof FailedValidation["errorType"];
}

/**
 * Represents either a successful or failed validation result
 */
export type Result<T extends Record<string, unknown> = Record<string, unknown>> =
    | Valid<T>
    | Invalid;

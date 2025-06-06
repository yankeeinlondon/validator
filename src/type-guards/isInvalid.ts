import type { Invalid, Result } from "~/types";

/**
 * type guard which tests whether the validator was `Invalid`
 */
export function isInvalid(val: Result<any>): val is Invalid {
  return val.success;
}

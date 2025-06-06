import { Result, Valid } from "~/types";

/**
 * type guard which tests whether the validator was indeed _validated_.
 */
export function isValid(val: Result): val is Valid {
    return val.success;
}

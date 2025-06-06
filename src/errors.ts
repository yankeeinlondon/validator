import { createKindError } from "@yankeeinlondon/kind-error";


export const UnexpectedError = createKindError(
    "Unexpected",
    { 
        library: "@yankeeinlondon/validator",
        reason: "an unexpected error occurred within a try/catch block"
    }
)


export const FailedValidation = createKindError(
    "FailedValidation",
    { 
        library: "@yankeeinlondon/validator", 
        reason: "The validation was completed successfully but the content didn't pass the validation test!" 
    }
)

export const InvalidSchema = createKindError(
    "InvalidSchema",
    {
        library: "@yankeeinlondon/validator",
        reason: "The validation can not be tested because the schema being referenced is invalid!"
    }
)

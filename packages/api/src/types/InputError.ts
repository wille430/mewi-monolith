import { Result, ValidationError } from "express-validator"

class InputError extends Error {
    status: number
    paramErrors: ValidationError[]
    message: string

    constructor(status: number, message: string, paramErrors: ValidationError[]) {
        super(message)

        this.status = status
        this.paramErrors = paramErrors
        this.message = message
    }
}

export default InputError
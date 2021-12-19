import { validationResult } from "express-validator"
import InputError from "types/InputError"


const ValidateInput = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new InputError(400, 'Invalid input', errors.array())
    } else {
        next()
    }
}

export default ValidateInput
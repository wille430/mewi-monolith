import { instanceToPlain } from "class-transformer";
import { ValidationError } from "class-validator";
import { NextApiRequest, NextApiResponse } from "next";
import { HttpException } from "next-api-decorators";

export interface ValidationExceptionRes {
    statusCode: number
    message: string
    errors: Record<string, any>[]
}

export const validationExceptionHandler = (
    { statusCode, message, errors }: ValidationException,
    req: NextApiRequest,
    res: NextApiResponse
) => {
    const jsonRes: ValidationExceptionRes = {
        statusCode,
        message,
        errors,
    };

    res.status(statusCode).json(jsonRes);
};

export interface IValidationException extends Omit<HttpException, "errors"> {
    errors: Record<string, any>[]
}

export class ValidationException implements IValidationException {
    name = "BadRequestException";
    statusCode = 400;

    errors: Record<string, any>[];
    message: string;

    constructor(errors: ValidationError[]) {
        this.errors = errors.map((e) => instanceToPlain(e));
        this.message = this.name;
    }
}

import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { ValidationPipeOptions } from 'next-api-decorators'
import { PipeMetadata } from 'next-api-decorators/dist/pipes/ParameterPipe'
import { ValidationException } from '../exceptions/validation.exception'

export const MyValidationPipe = (options?: ValidationPipeOptions) => {
    return async (value: any, metadata?: PipeMetadata) => {
        if (value === '') {
            value = {}
        }

        if (!metadata?.metaType) {
            return value
        }

        const bodyValue = plainToInstance(metadata.metaType, value, {
            enableImplicitConversion: true,
            ...options?.transformOptions,
        })
        const errors = await validate(bodyValue)

        if (errors.length) {
            throw new ValidationException(errors)
        }

        return bodyValue
    }
}

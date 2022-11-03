import { Catch } from 'next-api-decorators'
import { autoInjectable } from 'tsyringe'
import { ValidationException, validationExceptionHandler } from '../exceptions/validation.exception'

export const Controller = () => {
    return (target: any) => {
        Catch(validationExceptionHandler, ValidationException)(target)

        return autoInjectable()(target)
    }
}

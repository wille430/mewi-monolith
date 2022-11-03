import { Catch } from 'next-api-decorators'
import { autoInjectable } from 'tsyringe'
import { ValidationException, validationExceptionHandler } from '../exceptions/validation.exception'

export const Controller = () => {
    return (target: any) => {
        autoInjectable()(target)
        Catch(validationExceptionHandler, ValidationException)(target)
    }
}

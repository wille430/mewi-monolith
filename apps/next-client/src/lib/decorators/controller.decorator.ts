import { Catch, UseMiddleware } from 'next-api-decorators'
import { autoInjectable } from 'tsyringe'
import { ValidationException, validationExceptionHandler } from '../exceptions/validation.exception'
import { parseQueryMiddleware } from '../middlewares/parse-query.middleware'

export const Controller = () => {
    return (target: any) => {
        Catch(validationExceptionHandler, ValidationException)(target)
        UseMiddleware(parseQueryMiddleware)(target)

        return autoInjectable()(target)
    }
}

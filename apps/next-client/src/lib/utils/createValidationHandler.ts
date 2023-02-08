import type {FormikErrors} from 'formik'
import {ValidationExceptionRes} from '../exceptions/validation.exception'

export const createValidationHandler = <T>(
    handleProperty: (
        property: keyof T,
        constraint: string,
        ctx: {
            res: ValidationExceptionRes
            errors: FormikErrors<T>
        }
    ) => FormikErrors<T>[any]
): ((res: ValidationExceptionRes) => FormikErrors<T>) => {
    return (res: ValidationExceptionRes) => {
        const {errors} = res ?? {}
        const newErrors: FormikErrors<T> = {}

        if (!errors) {
            (newErrors as any).all = 'Ett fel inträffade'
            return newErrors
        }

        for (const {property, constraints} of errors) {
            for (const constraint of Object.keys(constraints ?? {})) {
                if (newErrors[property] != null) {
                    break
                }

                newErrors[property] = handleProperty(property, constraint, {
                    errors: newErrors,
                    res,
                })
            }
        }

        return newErrors
    }
}

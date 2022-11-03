import type { ValidationArguments, ValidatorConstraintInterface } from 'class-validator'
import { ValidatorConstraint } from 'class-validator'
import { isString, map } from 'lodash'

@ValidatorConstraint({
    name: 'IsPassword',
    async: false,
})
export class IsPassword implements ValidatorConstraintInterface {
    validate(value: any): boolean | Promise<boolean> {
        const funcs = [
            isString,
            (s: string) => s.length >= 8,
            (s: string) => s.length <= 32,
            (s: string) =>
                new RegExp(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/).test(s),
        ]
        return map(funcs, value).some((x) => !x)
    }
    defaultMessage?(_validationArguments?: ValidationArguments | undefined): string {
        return 'Password is too weak'
    }
}

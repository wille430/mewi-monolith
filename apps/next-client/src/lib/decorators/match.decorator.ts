import type {
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraintInterface} from "class-validator";
import {
    registerDecorator,
    ValidatorConstraint
} from "class-validator";

export const Match = (property: string, validationOptions?: ValidationOptions) => (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchConstraint,
        });
    };

@ValidatorConstraint({ name: "Match" })
export class MatchConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return value === relatedValue;
    }
}

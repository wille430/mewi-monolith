import { UserDocument } from '@/users/user.schema'
import { Injectable } from '@nestjs/common'
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { Model } from 'mongoose'

@ValidatorConstraint({ name: 'UniqueEmail', async: true })
@Injectable()
export class UniqueEmailRule implements ValidatorConstraintInterface {
    constructor(private userModel: Model<UserDocument>) {}

    async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
        try {
            const user = await this.userModel.find({ email: value })
            if (user) {
                return false
            } else {
                return true
            }
        } catch (e) {
            return false
        }
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Email is already in use'
    }
}

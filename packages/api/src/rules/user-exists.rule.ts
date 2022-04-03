import { Injectable } from '@nestjs/common'
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { Model } from 'mongoose'
import { UserDocument } from '@/users/user.schema'

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
    constructor(private userModel: Model<UserDocument>) {}

    async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
        try {
            const user = await this.userModel.find({ email: value })
            if (user) {
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return "User doesn't exist"
    }
}

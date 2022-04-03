import { Injectable } from '@nestjs/common'
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { Model } from 'mongoose'
import { User, UserDocument } from '@/users/user.schema'
import { InjectModel } from '@nestjs/mongoose'

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
        try {
            const user = await this.userModel.find({ email: value })
            if (!user || !user.length) {
                return false
            } else {
                return true
            }
        } catch (e) {
            return false
        }
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return "User doesn't exist"
    }
}

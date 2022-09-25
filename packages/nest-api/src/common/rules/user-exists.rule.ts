import { UsersRepository } from '@/users/users.repository'
import { Inject, Injectable } from '@nestjs/common'
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
    constructor(@Inject(UsersRepository) private usersRepository: UsersRepository) {}

    async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
        try {
            const user = await this.usersRepository.findOne({ email: value })
            if (!user) {
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

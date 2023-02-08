import type { ValidatorConstraintInterface } from 'class-validator'
import { ValidatorConstraint } from 'class-validator'
import { autoInjectable, inject } from 'tsyringe'
import { UsersRepository } from '../modules/users/users.repository'

@ValidatorConstraint({ name: 'UserExists', async: true })
@autoInjectable()
export class UserExistsRule implements ValidatorConstraintInterface {
    constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}

    async validate(value: string): Promise<boolean> {
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

    defaultMessage(): string {
        return "User doesn't exist"
    }
}

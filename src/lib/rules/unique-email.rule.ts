import type { ValidatorConstraintInterface } from 'class-validator'
import { ValidatorConstraint } from 'class-validator'
import { autoInjectable, inject } from 'tsyringe'
import { UsersRepository } from '@/lib/modules/users/users.repository'

@ValidatorConstraint({ name: 'UniqueEmail', async: true })
@autoInjectable()
export class UniqueEmailRule implements ValidatorConstraintInterface {
    constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}

    async validate(value: string): Promise<boolean> {
        try {
            const userCount =
                (await this.usersRepository.count({ email: value.toLowerCase() })) ?? 0

            if (userCount === 0) {
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }

    defaultMessage(): string {
        return 'Email is already in use'
    }
}

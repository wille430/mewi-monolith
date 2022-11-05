import type { ValidatorConstraintInterface } from 'class-validator'
import { ValidatorConstraint } from 'class-validator'
import { autoInjectable, inject } from 'tsyringe'
import { UsersRepository } from '@/lib/modules/users/users.repository'

@ValidatorConstraint({ name: 'UniqueEmail', async: true })
@autoInjectable()
export class UniqueEmailRule implements ValidatorConstraintInterface {
    constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}

    async validate(value: string): Promise<boolean> {
        const userCount = (await this.usersRepository.count({ email: value.toLowerCase() })) ?? 0

        return userCount === 0
    }

    defaultMessage(): string {
        return 'Email is already in use'
    }
}

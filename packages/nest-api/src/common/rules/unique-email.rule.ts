import { Inject, Injectable } from '@nestjs/common'
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { UsersRepository } from '@/users/users.repository'

@ValidatorConstraint({ name: 'UniqueEmail', async: true })
@Injectable()
export class UniqueEmailRule implements ValidatorConstraintInterface {
    constructor(@Inject(UsersRepository) private usersRepository: UsersRepository) {}

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

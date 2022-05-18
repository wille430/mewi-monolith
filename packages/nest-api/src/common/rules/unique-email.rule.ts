import { Inject, Injectable } from '@nestjs/common'
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { PrismaService } from '@/prisma/prisma.service'

@ValidatorConstraint({ name: 'UniqueEmail', async: true })
@Injectable()
export class UniqueEmailRule implements ValidatorConstraintInterface {
    constructor(@Inject(PrismaService) private prisma: PrismaService) {}

    async validate(value: string): Promise<boolean> {
        try {
            const userCount =
                (await this.prisma.user.count({ where: { email: value.toLowerCase() } })) ?? 0

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

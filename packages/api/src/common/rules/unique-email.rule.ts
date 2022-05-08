import { PrismaService } from '@/prisma/prisma.service'
import { Inject, Injectable } from '@nestjs/common'
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'UniqueEmail', async: true })
@Injectable()
export class UniqueEmailRule implements ValidatorConstraintInterface {
    constructor(@Inject(PrismaService) private prisma: PrismaService) {}

    async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
        try {
            const user = await this.prisma.user.findFirst({ where: { email: value } })
            if (!user) {
                return true
            } else {
                return false
            }
        } catch (e) {
            return false
        }
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Email is already in use'
    }
}

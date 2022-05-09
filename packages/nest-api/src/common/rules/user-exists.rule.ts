import { Inject, Injectable } from '@nestjs/common'
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'
import { PrismaService } from '@/prisma/prisma.service'

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
    constructor(@Inject(PrismaService) private prisma: PrismaService) {}

    async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
        try {
            const user = await this.prisma.user.findFirst({ where: { email: value } })
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

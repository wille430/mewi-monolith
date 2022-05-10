import { User } from '@mewi/prisma'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateUserDto implements Partial<User> {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    password: string
}

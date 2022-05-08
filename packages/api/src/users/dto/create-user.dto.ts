import { User } from '@prisma/client'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateUserDto implements Partial<User> {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    password: string
}

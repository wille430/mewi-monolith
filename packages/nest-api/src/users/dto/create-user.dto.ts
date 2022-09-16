import { User, Role } from '@mewi/prisma'
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateUserDto implements Partial<User> {
    @IsEmail()
    @IsNotEmpty()
    email!: string

    @IsNotEmpty()
    password!: string

    @IsOptional()
    @IsArray()
    @IsEnum(Role, { each: true })
    roles?: Role[]
}

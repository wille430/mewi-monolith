import { Role } from '@/schemas/enums/UserRole'
import { User } from '@/schemas/user.schema'
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

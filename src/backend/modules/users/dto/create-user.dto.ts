import { Role } from '@/common/schemas'
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import type { User } from '../../schemas/user.schema'

export class CreateUserDto implements Partial<User> {
    @IsEmail()
    @IsNotEmpty()
    email!: string

    @IsNotEmpty()
    // TODO: validate
    password!: string

    @IsOptional()
    @IsArray()
    @IsEnum(Role, { each: true })
    roles?: Role[]
}

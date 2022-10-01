import { IsPassword } from '@/common/decorators/password.decorator'
import { User } from '@/schemas/user.schema'
import { Role } from '@wille430/common'
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserDto implements Partial<User> {
    @IsEmail()
    @IsNotEmpty()
    email!: string

    @IsNotEmpty()
    @IsPassword()
    password!: string

    @IsOptional()
    @IsArray()
    @IsEnum(Role, { each: true })
    roles?: Role[]
}

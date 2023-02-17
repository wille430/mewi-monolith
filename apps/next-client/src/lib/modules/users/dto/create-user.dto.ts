import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import type { User } from '@mewi/entities'
import {Role} from "@mewi/models"

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

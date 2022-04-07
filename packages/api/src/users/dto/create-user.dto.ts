import { IUser } from '@wille430/common/types'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateUserDto implements Partial<IUser> {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    password: string
}

import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { Match } from '@/decorators/match.decorator'
import { IsPassword } from '@/decorators/password.decorator'

export class SignUpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsPassword()
    password: string

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Match('password', { message: 'passwords must match' })
    passwordConfirm: string
}

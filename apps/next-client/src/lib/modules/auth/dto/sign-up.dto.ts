import { UniqueEmailRule } from '@/lib/rules/unique-email.rule'
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator'
import { Match } from '@/lib/decorators/match.decorator'

export default class SignUpDto {
    @IsEmail()
    @IsNotEmpty()
    @Validate(UniqueEmailRule)
    email!: string

    // @IsPassword()
    password!: string

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Match('password', { message: 'passwords must match' })
    passwordConfirm!: string
}

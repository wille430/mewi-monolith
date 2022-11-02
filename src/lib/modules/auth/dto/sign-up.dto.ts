import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, Validate } from 'class-validator'
import { Match } from '../../common/decorators/match.decorator'
import { UniqueEmailRule } from '../../../rules/unique-email.rule'

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

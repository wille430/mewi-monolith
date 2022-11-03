import { Match } from '@/lib/decorators/match.decorator'
import { Expose } from 'class-transformer'
import { IsEmail, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator'

export class ChangePasswordNoAuth {
    @IsString()
    @IsEmail()
    email!: string
}

// TODO: add validation
export class ChangePasswordAuth {
    @Expose({ groups: ['user'] })
    password!: string

    passwordConfirm!: string
}

export class ChangePasswordWithToken extends ChangePasswordAuth {
    @IsString()
    token!: string

    @IsEmail()
    email!: string
}

export default class ChangePasswordDto {
    @ValidateIf((obj) => obj.passwordConfirm && obj.token)
    // TODO: VALIDATE
    password?: string

    @ValidateIf((obj) => obj.password && obj.token)
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Match('password', { message: 'passwords must match' })
    passwordConfirm?: string

    @ValidateIf((obj) => !obj.password && !obj.passwordConfirm)
    @IsString()
    @IsEmail()
    email?: string

    @IsString()
    @ValidateIf(() => false)
    token?: string
}

import { PickType } from '@nestjs/mapped-types'
import { Expose } from 'class-transformer'
import { IsEmail, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator'
import SignUpDto from '@/auth/dto/sign-up.dto'
import { Match } from '@/common/decorators/match.decorator'
import { IsPassword } from '@/common/decorators/password.decorator'

export class ChangePasswordNoAuth {
    @IsString()
    @IsEmail()
    email!: string
}

export class ChangePasswordAuth extends PickType(SignUpDto, ['passwordConfirm', 'password']) {
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
    @IsPassword()
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
    @ValidateIf((obj) => false)
    token?: string
}

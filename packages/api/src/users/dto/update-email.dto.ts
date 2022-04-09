import { PickType } from '@nestjs/mapped-types'
import { IsEmail, IsJWT, IsString, ValidateIf } from 'class-validator'

export class UpdateEmailDto {
    @ValidateIf((obj) => !obj.token)
    @IsEmail()
    newEmail: string

    @ValidateIf((obj) => obj.token)
    @IsString()
    @IsEmail()
    oldEmail: string

    @ValidateIf((obj) => !obj.oldEmail)
    @IsJWT()
    token: string
}

export class AuthorizedUpdateEmailDto extends PickType(UpdateEmailDto, ['token', 'oldEmail']) {}

export class VerifyEmailDto extends PickType(UpdateEmailDto, ['newEmail']) {}

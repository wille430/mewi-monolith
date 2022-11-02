import { IsEmail, IsString, Validate, ValidateIf } from 'class-validator'
import { Transform } from 'class-transformer'
import { UniqueEmailRule } from '../../../rules/unique-email.rule'

export class UpdateEmailDto {
    @Transform(({ value }) => value.toLowerCase())
    @ValidateIf((obj) => !obj.token)
    @IsEmail()
    @Validate(UniqueEmailRule)
    newEmail?: string

    @ValidateIf((obj) => obj.token)
    @IsString()
    @IsEmail()
    oldEmail?: string

    @ValidateIf((obj) => obj.oldEmail)
    token?: string
}

export class AuthorizedUpdateEmailDto {
    @IsString()
    @IsEmail()
    oldEmail?: string

    @IsString()
    token?: string
}

export class RequestEmailUpdateDto {
    @Transform(({ value }) => value.toLowerCase())
    @IsString()
    @IsEmail()
    @Validate(UniqueEmailRule)
    newEmail?: string
}

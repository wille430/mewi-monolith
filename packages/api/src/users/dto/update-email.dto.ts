import { UniqueEmailRule } from '@/common/rules/unique-email.rule'
import { PickType } from '@nestjs/mapped-types'
import { IsEmail, IsString, Validate, ValidateIf } from 'class-validator'

export class UpdateEmailDto {
    @ValidateIf((obj) => !obj.token)
    @IsEmail()
    @Validate(UniqueEmailRule)
    newEmail: string

    @ValidateIf((obj) => obj.token)
    @IsString()
    @IsEmail()
    oldEmail: string

    @ValidateIf((obj) => obj.oldEmail)
    token: string
}

export class AuthorizedUpdateEmailDto extends PickType(UpdateEmailDto, ['token', 'oldEmail']) {}

export class VerifyEmailDto extends PickType(UpdateEmailDto, ['newEmail']) {}

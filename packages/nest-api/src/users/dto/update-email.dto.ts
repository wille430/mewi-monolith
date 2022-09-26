import { PickType } from '@nestjs/mapped-types'
import { IsEmail, IsString, Validate, ValidateIf } from 'class-validator'
import { UniqueEmailRule } from '@/common/rules/unique-email.rule'
import { Transform } from 'class-transformer'

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

export class AuthorizedUpdateEmailDto extends PickType(UpdateEmailDto, ['token', 'oldEmail']) {}

export class RequestEmailUpdateDto {
    @Transform(({ value }) => value.toLowerCase())
    @IsString()
    @IsEmail()
    @Validate(UniqueEmailRule)
    newEmail?: string
}

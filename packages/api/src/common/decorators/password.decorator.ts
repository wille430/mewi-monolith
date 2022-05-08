import { applyDecorators } from '@nestjs/common'
import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

export const IsPassword = () =>
    applyDecorators(
        IsString(),
        MinLength(8),
        MaxLength(20),
        Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message: 'password is too weak',
        })
    )

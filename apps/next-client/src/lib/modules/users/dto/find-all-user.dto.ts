import { IsOptional, IsString } from 'class-validator'
import type { FilterQuery } from 'mongoose'
import type { User } from '@mewi/entities'

export class FindAllUserDto implements FilterQuery<User> {
    @IsOptional()
    @IsString()
    email?: string
}

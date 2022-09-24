import { UserDocument } from '@/schemas/user.schema'
import { IsOptional, IsString } from 'class-validator'
import { FilterQuery } from 'mongoose'

export class FindAllUserDto implements FilterQuery<UserDocument> {
    @IsOptional()
    @IsString()
    email?: string
}

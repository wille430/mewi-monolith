import { IsOptional, IsString } from 'class-validator'
import { Prisma } from '@mewi/prisma'

export class FindAllUserDto implements Prisma.UserWhereInput {
    @IsOptional()
    @IsString()
    email?: string
}

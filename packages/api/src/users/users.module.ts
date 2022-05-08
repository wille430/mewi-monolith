import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { EmailModule } from '@/email/email.module'
import { PrismaService } from '@/prisma/prisma.service'

@Module({
    imports: [EmailModule],
    controllers: [UsersController],
    providers: [UsersService, PrismaService],
    exports: [EmailModule],
})
export class UsersModule {}

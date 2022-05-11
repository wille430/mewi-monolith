import { Module } from '@nestjs/common'
import { WatchersService } from './watchers.service'
import { WatchersController } from './watchers.controller'
import { UsersModule } from '@/users/users.module'
import { EmailModule } from '@/email/email.module'
import { ListingsModule } from '@/listings/listings.module'
import { PrismaService } from '@/prisma/prisma.service'

@Module({
    imports: [UsersModule, EmailModule, ListingsModule],
    controllers: [WatchersController],
    providers: [WatchersService, PrismaService],
    exports: [UsersModule, WatchersService],
})
export class WatchersModule {}

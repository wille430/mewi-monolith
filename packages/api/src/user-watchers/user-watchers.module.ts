import { Module } from '@nestjs/common'
import { UserWatchersService } from './user-watchers.service'
import { UserWatchersController, MyWatchersController } from './user-watchers.controller'
import { WatchersModule } from '@/watchers/watchers.module'
import { PrismaService } from '@/prisma/prisma.service'

@Module({
    controllers: [MyWatchersController, UserWatchersController],
    providers: [UserWatchersService, PrismaService],
    imports: [WatchersModule],
})
export class UserWatchersModule {}

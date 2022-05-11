import { Module } from '@nestjs/common'
import { UserWatchersService } from './user-watchers.service'
import { UserWatchersController, MyWatchersController } from './user-watchers.controller'
import { PrismaService } from '@/prisma/prisma.service'
import { WatchersModule } from '@/watchers/watchers.module'

@Module({
    controllers: [MyWatchersController, UserWatchersController],
    providers: [UserWatchersService, PrismaService],
    imports: [WatchersModule],
})
export class UserWatchersModule {}

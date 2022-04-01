import { Module } from '@nestjs/common'
import { UserWatchersService } from './user-watchers.service'
import { UserWatchersController, MyWatchersController } from './user-watchers.controller'
import { WatchersModule } from '@/watchers/watchers.module'

@Module({
    controllers: [MyWatchersController, UserWatchersController],
    providers: [UserWatchersService],
    imports: [WatchersModule],
})
export class UserWatchersModule {}

import { Module } from '@nestjs/common'
import { UserWatchersService } from './user-watchers.service'
import { UserWatchersController, MyWatchersController } from './user-watchers.controller'
import { UsersModule } from 'users/users.module'
import { WatchersModule } from 'watchers/watchers.module'
import { WatchersService } from 'watchers/watchers.service'

@Module({
  controllers: [MyWatchersController, UserWatchersController],
  providers: [UserWatchersService, WatchersService],
  imports: [UsersModule, WatchersModule],
})
export class UserWatchersModule {}

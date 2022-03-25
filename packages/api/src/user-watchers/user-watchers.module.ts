import { Module } from '@nestjs/common'
import { UserWatchersService } from './user-watchers.service'
import { UserWatchersController, MyWatchersController } from './user-watchers.controller'
import { UsersModule } from 'users/users.module'
import { WatchersModule } from 'watchers/watchers.module'

@Module({
  controllers: [MyWatchersController, UserWatchersController],
  providers: [UserWatchersService],
  imports: [UsersModule, WatchersModule],
})
export class UserWatchersModule {}

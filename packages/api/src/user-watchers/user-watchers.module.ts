import { Module } from '@nestjs/common';
import { UserWatchersService } from './user-watchers.service';
import { UserWatchersController } from './user-watchers.controller';

@Module({
  controllers: [UserWatchersController],
  providers: [UserWatchersService]
})
export class UserWatchersModule {}

import { Module } from '@nestjs/common';
import { WatchersService } from './watchers.service';
import { WatchersController } from './watchers.controller';

@Module({
  controllers: [WatchersController],
  providers: [WatchersService]
})
export class WatchersModule {}

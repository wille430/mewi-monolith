import { Module } from '@nestjs/common'
import { WatchersService } from './watchers.service'
import { WatchersController } from './watchers.controller'
import { Watcher, WatcherSchema } from 'watchers/watcher.schema'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Watcher.name,
        schema: WatcherSchema,
      },
    ]),
  ],
  controllers: [WatchersController],
  providers: [WatchersService],
  exports: [MongooseModule],
})
export class WatchersModule {}

import { Module } from '@nestjs/common'
import { WatchersService } from './watchers.service'
import { WatchersController } from './watchers.controller'
import { Watcher, WatcherSchema } from 'watchers/watcher.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from 'users/users.module'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Watcher.name,
                schema: WatcherSchema,
            },
        ]),
        UsersModule,
    ],
    controllers: [WatchersController],
    providers: [WatchersService],
    exports: [MongooseModule],
})
export class WatchersModule {}

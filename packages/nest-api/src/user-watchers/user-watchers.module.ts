import { forwardRef, Module } from '@nestjs/common'
import { UserWatchersService } from './user-watchers.service'
import { UserWatchersController, MyWatchersController } from './user-watchers.controller'
import { WatchersModule } from '@/watchers/watchers.module'
import { UserWatchersRepository } from './user-watchers.repository'
import { MongooseModule } from '@nestjs/mongoose'
import { UserWatcher, UserWatcherSchema } from '@/schemas/user-watcher.schema'

@Module({
    controllers: [MyWatchersController, UserWatchersController],
    providers: [UserWatchersService, UserWatchersRepository],
    imports: [
        forwardRef(() => WatchersModule),
        MongooseModule.forFeature([
            {
                name: UserWatcher.name,
                schema: UserWatcherSchema,
            },
        ]),
    ],
    exports: [UserWatchersRepository, MongooseModule],
})
export class UserWatchersModule {}

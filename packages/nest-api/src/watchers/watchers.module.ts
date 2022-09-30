import { Module } from '@nestjs/common'
import { WatchersService } from './watchers.service'
import { WatchersController } from './watchers.controller'
import { UsersModule } from '@/users/users.module'
import { EmailModule } from '@/email/email.module'
import { ListingsModule } from '@/listings/listings.module'
import { WatchersRepository } from './watchers.repository'
import { MongooseModule } from '@nestjs/mongoose'
import { Watcher, WatcherSchema } from '@/schemas/watcher.schema'
import { UserWatchersModule } from '@/user-watchers/user-watchers.module'

@Module({
    imports: [
        UsersModule,
        EmailModule,
        ListingsModule,
        UserWatchersModule,
        MongooseModule.forFeature([
            {
                name: Watcher.name,
                schema: WatcherSchema,
            },
        ]),
    ],
    controllers: [WatchersController],
    providers: [WatchersService, WatchersRepository],
    exports: [UsersModule, WatchersService, WatchersRepository],
})
export class WatchersModule {}

import { Module } from '@nestjs/common'
import { WatchersService } from './watchers.service'
import { WatchersController } from './watchers.controller'
import { Watcher, WatcherSchema } from '@/watchers/watcher.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from '@/users/users.module'
import { EmailModule } from '@/email/email.module'
import { ListingsModule } from '@/listings/listings.module'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Watcher.name,
                schema: WatcherSchema,
            },
        ]),
        UsersModule,
        EmailModule,
        ListingsModule,
    ],
    controllers: [WatchersController],
    providers: [WatchersService],
    exports: [MongooseModule, UsersModule, WatchersService],
})
export class WatchersModule {}

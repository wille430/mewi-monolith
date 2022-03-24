import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from 'app.controller'
import { ListingsModule } from 'listings/listings.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { UserWatchersModule } from './user-watchers/user-watchers.module'
import { WatchersModule } from './watchers/watchers.module';

const { MONGO_URI, MONGO_USERNAME, MONGO_PASSWORD } = process.env

let mongodbUri

if (!MONGO_USERNAME || !MONGO_PASSWORD) {
  mongodbUri = 'mongodb://' + MONGO_URI
} else {
  mongodbUri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_URI}`
}

@Module({
  imports: [
    MongooseModule.forRoot(mongodbUri),
    ListingsModule,
    AuthModule,
    UsersModule,
    UserWatchersModule,
    WatchersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

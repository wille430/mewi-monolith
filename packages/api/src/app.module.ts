import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from 'app.controller'
import { ListingsModule } from 'listings/listings.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { UserWatchersModule } from './user-watchers/user-watchers.module'
import { WatchersModule } from './watchers/watchers.module';
import {ConfigModule} from '@nestjs/config'

const getMongoUri = () => {
  const { MONGO_URI, MONGO_USERNAME, MONGO_PASSWORD } = process.env

  let mongodbUri

  if (!MONGO_USERNAME || !MONGO_PASSWORD) {
    mongodbUri = 'mongodb://' + MONGO_URI || 'localhost'
  } else {
    mongodbUri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_URI}`
  }

  console.log({mongodbUri})
  return mongodbUri
}

@Module({
  imports: [ 
       ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(getMongoUri()),
    ListingsModule,
    AuthModule,
    UsersModule,
    UserWatchersModule,
    WatchersModule,

  ],
  controllers: [AppController],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { ListingsModule } from '@/listings/listings.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { UserWatchersModule } from './user-watchers/user-watchers.module'
import { WatchersModule } from './watchers/watchers.module'
import { ConfigModule } from '@nestjs/config'
import { TestModule } from './test/test.module'
import { ScrapersModule } from './scrapers/scrapers.module'
import { EmailService } from './email/email.service'
import { EmailModule } from './email/email.module'
import configuration from './config/configuration'
import { ThrottlerModule } from '@nestjs/throttler'
import scraperConfig from './config/scraper.config'

const getMongoUri = () => {
    const { MONGO_URI, MONGO_USERNAME, MONGO_PASSWORD } = process.env

    let mongodbUri

    if (!MONGO_USERNAME || !MONGO_PASSWORD) {
        mongodbUri = 'mongodb://' + MONGO_URI || 'localhost'
    } else {
        mongodbUri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_URI}`
    }

    console.log({ mongodbUri })
    return mongodbUri
}

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            load: [configuration, scraperConfig],
        }),
        MongooseModule.forRoot(getMongoUri()),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        ListingsModule,
        AuthModule,
        UsersModule,
        UserWatchersModule,
        WatchersModule,
        TestModule,
        ScrapersModule,
        EmailModule,
    ],
    controllers: [AppController],
    providers: [EmailService],
})
export class AppModule {}

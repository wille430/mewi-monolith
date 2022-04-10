import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller'
import { ListingsModule } from '@/listings/listings.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { UserWatchersModule } from './user-watchers/user-watchers.module'
import { WatchersModule } from './watchers/watchers.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TestModule } from './test/test.module'
import { ScrapersModule } from './scrapers/scrapers.module'
import { EmailService } from './email/email.service'
import { EmailModule } from './email/email.module'
import configuration from './config/configuration'
import { ThrottlerModule } from '@nestjs/throttler'
import scraperConfig from './config/scraper.config'
import databaseConfig from './config/database.config'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            load: [configuration, scraperConfig, databaseConfig],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('database.uri'),
            }),
            inject: [ConfigService],
        }),
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

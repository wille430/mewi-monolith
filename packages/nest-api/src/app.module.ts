import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ScheduleModule } from '@nestjs/schedule'
import { join } from 'path'
import configuration from './config/configuration'
import scraperConfig from './config/scraper.config'
import databaseConfig from './config/database.config'
import notificationConfig from './config/notification.config'
import { AppController } from './app.controller'
import { PrismaModule } from './prisma/prisma.module'
import { EmailModule } from './email/email.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ScrapersModule } from './scrapers/scrapers.module'
import { TestModule } from './test/test.module'
import { WatchersModule } from './watchers/watchers.module'
import { UserWatchersModule } from './user-watchers/user-watchers.module'
import authConfig from './config/auth.config'
import { ListingsModule } from '@/listings/listings.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            load: [configuration, scraperConfig, databaseConfig, notificationConfig, authConfig],
        }),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        ScheduleModule.forRoot(),
        ListingsModule,
        PrismaModule,
        EmailModule,
        AuthModule,
        UsersModule,
        ScrapersModule,
        TestModule,
        WatchersModule,
        UserWatchersModule,
    ],
    controllers: [AppController],
})
export class AppModule {}

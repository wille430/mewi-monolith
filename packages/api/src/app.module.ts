import { Module } from '@nestjs/common'
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
import databaseConfig from './config/database.config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import notificationConfig from './config/notification.config'
import { ScheduleModule } from '@nestjs/schedule'
import { PrismaModule } from './prisma/prisma.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            load: [configuration, scraperConfig, databaseConfig, notificationConfig],
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
        AuthModule,
        UsersModule,
        UserWatchersModule,
        WatchersModule,
        TestModule,
        ScrapersModule,
        PrismaModule,
        EmailModule,
    ],
    controllers: [AppController],
    providers: [EmailService],
})
export class AppModule {}

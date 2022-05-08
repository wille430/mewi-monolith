import { ListingsModule } from '@/listings/listings.module'
import { PrismaService } from '@/prisma/prisma.service'
import { UsersModule } from '@/users/users.module'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Scrapers from './scrapers'
import { ScrapersController } from './scrapers.controller'
import { ScrapersService } from './scrapers.service'

@Module({
    imports: [ListingsModule, ListingsModule, UsersModule],
    providers: [ScrapersService, ConfigService, PrismaService, ...Scrapers],
    controllers: [ScrapersController],
    exports: [ListingsModule],
})
export class ScrapersModule {}

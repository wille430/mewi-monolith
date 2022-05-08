import { CacheModule, Module } from '@nestjs/common'
import { ListingsService } from './listings.service'
import { ListingsController } from './listings.controller'
import { PrismaService } from '@/prisma/prisma.service'

@Module({
    imports: [CacheModule.register()],
    controllers: [ListingsController],
    providers: [ListingsService, PrismaService],
    exports: [ListingsService],
})
export class ListingsModule {}

import { CacheModule, Module } from '@nestjs/common'
import { ListingsService } from './listings.service'
import { ListingsController } from './listings.controller'
import { PrismaModule } from '@/prisma/prisma.module'
import { UsersModule } from '@/users/users.module'

@Module({
    imports: [CacheModule.register(), PrismaModule, UsersModule],
    controllers: [ListingsController],
    providers: [ListingsService],
    exports: [ListingsService],
})
export class ListingsModule {}

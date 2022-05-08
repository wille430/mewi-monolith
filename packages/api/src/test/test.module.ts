import { Module } from '@nestjs/common'
import { TestService } from './test.service'
import { TestController } from './test.controller'
import { UsersService } from '@/users/users.service'
import { UsersModule } from '@/users/users.module'
import { AuthModule } from '@/auth/auth.module'
import { PrismaService } from '@/prisma/prisma.service'

@Module({
    controllers: [TestController],
    providers: [TestService, UsersService, PrismaService],
    imports: [UsersModule, AuthModule],
})
export class TestModule {}

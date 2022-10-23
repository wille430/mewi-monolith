import { AuthModule } from '@/auth/auth.module'
import { UsersModule } from '@/users/users.module'
import { Module } from '@nestjs/common'
import { TestController } from './test.controller'
import { TestService } from './test.service'

@Module({
    imports: [UsersModule, AuthModule],
    providers: [TestService],
    controllers: [TestController],
    exports: [TestService],
})
export class TestModule {}

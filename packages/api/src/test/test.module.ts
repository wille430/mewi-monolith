import { Module } from '@nestjs/common'
import { TestService } from './test.service'
import { TestController } from './test.controller'
import { AuthModule } from '@/auth/auth.module'

@Module({
    controllers: [TestController],
    providers: [TestService],
    imports: [AuthModule],
})
export class TestModule {}

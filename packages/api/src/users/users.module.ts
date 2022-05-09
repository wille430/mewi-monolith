import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { EmailModule } from '@/email/email.module'

@Module({
    imports: [EmailModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [EmailModule],
})
export class UsersModule {}

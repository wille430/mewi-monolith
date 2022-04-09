import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '@/users/user.schema'
import { EmailModule } from '@/email/email.module'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
        EmailModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [MongooseModule, EmailModule],
})
export class UsersModule {}

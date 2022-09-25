import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { EmailModule } from '@/email/email.module'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '@/schemas/user.schema'
import { UsersRepository } from './users.repository'

@Module({
    imports: [
        EmailModule,
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [MongooseModule, UsersService, UsersRepository],
})
export class UsersModule {}

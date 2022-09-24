import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { EmailModule } from '@/email/email.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '@/schemas/user.schema'

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
    providers: [UsersService],
    exports: [EmailModule, PrismaModule],
})
export class UsersModule {}

import { Module } from '@nestjs/common'
import { UsersModule } from '@/users/users.module'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from '@/auth/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from '@/auth/constants'
import { JwtStrategy } from '@/auth/jwt-strategy'
import { AuthController } from './auth.controller'
import { UserExistsRule } from '@/rules/user-exists.rule'
import { UniqueEmailRule } from '@/rules/unique-email.rule'

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '15m' },
        }),
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, UserExistsRule, UniqueEmailRule],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}

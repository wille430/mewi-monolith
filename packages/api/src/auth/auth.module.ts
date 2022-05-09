import { Module } from '@nestjs/common'
import { UsersModule } from '@/users/users.module'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from '@/auth/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from '@/auth/constants'
import { JwtStrategy } from '@/auth/jwt-strategy'
import { AuthController } from './auth.controller'
import { UserExistsRule } from '@/common/rules/user-exists.rule'
import { UniqueEmailRule } from '@/common/rules/unique-email.rule'
import { GoogleStrategy } from '@/auth/google.strategy'

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '15m' },
        }),
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        GoogleStrategy,
        UserExistsRule,
        UniqueEmailRule,
    ],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '@/users/users.module'
import { LocalStrategy } from '@/auth/local.strategy'
import { jwtConstants } from '@/auth/constants'
import { JwtStrategy } from '@/auth/jwt-strategy'
import { UserExistsRule } from '@/common/rules/user-exists.rule'
import { UniqueEmailRule } from '@/common/rules/unique-email.rule'
import { GoogleStrategy } from '@/auth/google.strategy'

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => {
                return {
                    secret: jwtConstants.secret,
                    signOptions: { expiresIn: config.get<string>('auth.accessToken.expiresIn') },
                }
            },
            inject: [ConfigService],
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

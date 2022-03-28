import { Module } from '@nestjs/common'
import { UsersModule } from 'users/users.module'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from 'auth/local.strategy'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from 'auth/constants'
import { JwtStrategy } from 'auth/jwt-strategy'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

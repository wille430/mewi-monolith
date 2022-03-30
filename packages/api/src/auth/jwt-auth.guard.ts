import { ExecutionContext } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { IS_PUBLIC_KEY } from '@/decorators/public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (isPublic) {
            return true
        }

        return super.canActivate(context)
    }
}

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
        return user
    }
}

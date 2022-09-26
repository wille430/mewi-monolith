import { UserPayload } from '@/auth/jwt-strategy'
import { adminUserPayloadStub } from '@/users/test/stubs/admin-user-payload.stub'
import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

export abstract class JwtAuthGuard extends AuthGuard('jwt') {
    payload!: UserPayload
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        req.user = this.payload

        return true
    }
}

export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    payload!: UserPayload
    constructor(private reflector: Reflector) {
        super()
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
        return this.payload as any
    }
}

export const createJwtAuthGuard = (payload: UserPayload) => {
    JwtAuthGuard.prototype.payload = payload
    return JwtAuthGuard
}

export const createOptionalJwtAuthGuard = (payload: UserPayload) => {
    OptionalJwtAuthGuard.prototype.payload = payload
    return OptionalJwtAuthGuard
}

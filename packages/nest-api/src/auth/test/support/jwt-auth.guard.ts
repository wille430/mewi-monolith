import { adminUserPayloadStub } from '@/users/test/stubs/admin-user-payload.stub'
import { ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()
        req.user = adminUserPayloadStub()

        return true
    }
}

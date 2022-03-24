import { ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { JwtAuthGuard } from './jwt-auth.guard'

@Injectable()
export class OwnedResourceGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context)
  }
}

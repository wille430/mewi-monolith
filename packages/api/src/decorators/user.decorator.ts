import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserPayload } from 'auth/jwt-strategy'

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.user as UserPayload
})
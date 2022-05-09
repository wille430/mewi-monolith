import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '@/auth/roles.decorator'
import { PrismaService } from '@/prisma/prisma.service'
import { Role } from '@wille430/common'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        @Inject(PrismaService) private prisma: PrismaService,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler())
        if (!roles) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user = await this.prisma.user.findUnique({ where: { id: request.user.userId } })

        if (!user) {
            return false
        }

        return roles.some((role) => user.roles?.includes(role))
    }
}

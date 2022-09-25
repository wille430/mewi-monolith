import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '@/auth/roles.decorator'
import { UsersRepository } from '@/users/users.repository'
import { Role } from '@/schemas/enums/UserRole'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        @Inject(UsersRepository) private usersRepository: UsersRepository,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler())
        if (!roles) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user = await this.usersRepository.findById(request.user.userId)

        console.log({ user, payload: request.user, roles: user?.roles })

        if (!user) {
            return false
        }

        return roles.some((role) => user.roles?.includes(role))
    }
}

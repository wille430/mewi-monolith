import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { InjectModel } from '@nestjs/mongoose'
import { Role } from '@/auth/role.enum'
import { ROLES_KEY } from '@/auth/roles.decorator'
import { User, UserDocument } from '@/users/user.schema'
import { Model } from 'mongoose'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler())
        if (!roles) {
            return true
        }

        const request = context.switchToHttp().getRequest()
        const user = await this.userModel.findOne({ _id: request.user.userId })

        if (!user) {
            return false
        }

        return roles.some((role) => user.roles?.includes(role))
    }
}

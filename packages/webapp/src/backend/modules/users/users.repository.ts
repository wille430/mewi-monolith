import { autoInjectable } from 'tsyringe'
import { EntityRepository } from '../database/entity.repository'
import type { UserDocument } from '../schemas/user.schema'
import { UserModel } from '../schemas/user.schema'

@autoInjectable()
export class UsersRepository extends EntityRepository<UserDocument> {
    constructor() {
        super(UserModel as any)
    }
}

import { autoInjectable } from 'tsyringe'
import { EntityRepository } from '../database/entity.repository'
import type { UserDocument } from '@mewi/entities'
import { UserModel } from '@mewi/entities'

@autoInjectable()
export class UsersRepository extends EntityRepository<UserDocument> {
    constructor() {
        super(UserModel as any)
    }
}

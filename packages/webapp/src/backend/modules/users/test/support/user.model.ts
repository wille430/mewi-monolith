import { userStub } from '../stubs/user.stub'
import { MockModel } from '@/database/test/support/mock.model'
import type { User } from '@/schemas/user.schema'

export class UserModel extends MockModel<User> {
    protected entityStub = userStub()
}

import { userStub } from '../stubs/user.stub'
import { MockModel } from '@/backend/modules/database/test/support/mock.model'
import { User } from '@/backend/modules/schemas/user.schema'

export class UserModel extends MockModel<User> {
    protected entityStub = userStub()
}

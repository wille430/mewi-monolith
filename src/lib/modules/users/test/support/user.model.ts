import { userStub } from '../stubs/user.stub'
import { MockModel } from '@/lib/modules/database/test/support/mock.model'
import { User } from '@/lib/modules/schemas/user.schema'

export class UserModel extends MockModel<User> {
    protected entityStub = userStub()
}

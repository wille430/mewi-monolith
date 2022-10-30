import { MockModel } from '../../database/test/support/mock.model'
import { userStub } from '../../users/test/stubs/user.stub'
import { User } from '../user.schema'

export class UserModel extends MockModel<User> {
    protected entityStub = userStub()
}

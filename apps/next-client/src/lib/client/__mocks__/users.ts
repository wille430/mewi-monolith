import { userStub } from '@/lib/modules/users/test/stubs/user.stub'

export const getMe = jest.fn().mockResolvedValue(userStub())

import { userPayloadStub } from '@/lib/modules/users/test/stubs/user-payload.stub'

export const getSession = jest.fn().mockResolvedValue({
    user: userPayloadStub(),
    save: jest.fn(),
})

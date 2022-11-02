import { userStub } from '@mewi/test-utils'

export const getMe = jest.fn().mockResolvedValue(userStub())

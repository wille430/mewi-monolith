import { userStub } from '@mewi/test-utils'

export const withUser = jest.fn((handler) =>
    jest.fn((context) =>
        Promise.resolve(handler(Object.assign(context, { req: { user: userStub() } })))
    )
)

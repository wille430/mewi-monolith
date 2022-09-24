import { userStub } from '../test/stubs/user.stub'

export const UsersService = jest.fn().mockReturnValue({
    create: jest.fn().mockResolvedValue(userStub()),
    findAll: jest.fn().mockResolvedValue([userStub()]),
    findOne: jest.fn().mockResolvedValue(userStub()),
    update: jest.fn().mockResolvedValue(userStub()),
    remove: jest.fn().mockResolvedValue(userStub()),
    updateEmail: jest.fn().mockImplementationOnce(() => Promise.resolve()),
    verifyEmailUpdate: jest.fn().mockImplementationOnce(() => Promise.resolve()),
    changePassword: jest.fn().mockImplementationOnce(() => Promise.resolve()),
    changePasswordWithToken: jest.fn().mockImplementationOnce(() => Promise.resolve()),
    sendPasswordResetEmail: jest.fn().mockImplementationOnce(() => Promise.resolve()),
})

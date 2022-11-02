import { userStub } from '../test/stubs/user.stub'

export const UsersService = jest.fn().mockReturnValue({
    create: jest.fn().mockResolvedValue(userStub()),
    findAll: jest.fn().mockResolvedValue([userStub()]),
    findOne: jest.fn().mockResolvedValue(userStub()),
    update: jest.fn().mockResolvedValue(userStub()),
    remove: jest.fn().mockResolvedValue(userStub()),
    updateEmail: jest.fn().mockResolvedValue(() => Promise.resolve()),
    requestEmailUpdate: jest.fn().mockResolvedValue(() => Promise.resolve()),
    changePassword: jest.fn().mockResolvedValue(() => Promise.resolve()),
    changePasswordWithToken: jest.fn().mockResolvedValue(() => Promise.resolve()),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(() => Promise.resolve()),
    getLikedListings: jest.fn().mockResolvedValue(userStub().likedListings),
})

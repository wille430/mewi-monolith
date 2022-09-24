import { userStub } from '../test/stubs/user.stub'

export const UsersRepository = jest.fn().mockReturnValue({
    findOne: jest.fn().mockResolvedValue(userStub()),
    findById: jest.fn().mockResolvedValue(userStub()),
    find: jest.fn().mockResolvedValue([userStub()]),
    create: jest.fn().mockResolvedValue(userStub()),
    findByIdAndUpdate: jest.fn().mockResolvedValue(userStub()),
    findByIdAndDelete: jest.fn().mockResolvedValue(userStub()),
})

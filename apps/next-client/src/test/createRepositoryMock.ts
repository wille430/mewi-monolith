export const createRepositoryMock = (stub: any) => {
    return jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(stub),
        findById: jest.fn().mockResolvedValue(stub),
        find: jest.fn().mockResolvedValue([stub]),
        create: jest.fn().mockResolvedValue(stub),
        createMany: jest.fn().mockResolvedValue({
            count: 1,
        }),
        findByIdAndUpdate: jest.fn().mockResolvedValue(stub),
        findByOneAndUpdate: jest.fn().mockResolvedValue(stub),
        updateMany: jest.fn().mockResolvedValue([stub]),
        findByIdAndDelete: jest.fn().mockResolvedValue(stub),
        deleteMany: jest.fn().mockResolvedValue(1),
        aggregate: jest.fn().mockResolvedValue([stub]),
        sample: jest.fn().mockResolvedValue([stub]),
        count: jest.fn().mockResolvedValue(1),
    });
};

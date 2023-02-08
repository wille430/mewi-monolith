/* eslint-disable @typescript-eslint/no-empty-function */
export const createMockModel = <T>(entity: T) => {
    function Constructor() {}

    Object.assign(Constructor, {
        findOne: jest.fn().mockReturnValue(createQuery(entity)),
        findById: jest.fn().mockReturnValue(createQuery(entity)),
        find: jest.fn().mockReturnValue(createQuery([entity])),
        findOneAndUpdate: jest.fn().mockReturnValue(entity),
        create: jest.fn().mockReturnValue(entity),
        constructor: jest.fn().mockReturnValue(entity),
    })

    Constructor.prototype = {
        save: jest.fn().mockResolvedValue(entity),
    }

    return Constructor
}

const createQuery = (entity: any) => ({
    exec: jest.fn().mockResolvedValue(entity),
    skip: jest.fn(),
    limit: jest.fn(),
    sort: jest.fn(),
})

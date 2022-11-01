export const createEntityStub = (stub: any) => ({
    ...stub,
    populate: jest.fn(),
})

import { createMocks } from 'node-mocks-http'

export type RequestMock<T = any> = (...args: Parameters<typeof createMocks>) => Promise<T>

export const createRequestMock = (handler: (req: any, res: any) => any): (() => Promise<any>) => {
    let req: ReturnType<typeof createMocks>['req']
    let res: ReturnType<typeof createMocks>['res']

    const requestMock = async <T>(...args: Parameters<typeof createMocks>): Promise<T> => {
        ({ req, res } = createMocks(...args))
        await handler(req, res)
        return res._getData()
    }
    return requestMock
}

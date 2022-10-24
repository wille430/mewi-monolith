import type { GetServerSidePropsContext } from 'next'

export const contextStub = (): GetServerSidePropsContext =>
    ({
        req: {},
        res: {},
    } as any)

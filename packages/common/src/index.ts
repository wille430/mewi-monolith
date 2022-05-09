import { prisma } from '@prisma/client'
import { Context } from './index.d'

export * as Error from './error'
export * from './types'
export * from './utils'

export * from '@prisma/client'

export const createContext = async (ctx: any): Promise<Context> => {
    return { ...ctx, prisma }
}

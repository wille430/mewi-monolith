import { getIronSession } from 'iron-session'
import type { NextApiRequest, NextApiResponse } from 'next'
import { sessionOptions } from './sessionOptions'

export const getSession = (req: NextApiRequest, res: NextApiResponse) => {
    return getIronSession(req, res, sessionOptions)
}

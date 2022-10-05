import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute } from '@/lib/withSession'

export default withSessionRoute(userRoute)

async function userRoute(req: NextApiRequest, res: NextApiResponse) {
    if (!req.session.user?.id) {
        return res.status(401).json({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const user = null

    res.json(user)
}

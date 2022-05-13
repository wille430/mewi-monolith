import prisma from '@/lib/prisma'
import { withSessionRoute } from '@/lib/withSession'
import { NextApiRequest, NextApiResponse } from 'next'

export default withSessionRoute(userRoute)

async function userRoute(req: NextApiRequest, res: NextApiResponse) {
    if (!req.session.user) {
        return res.status(401).json({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const user = await prisma.user.findUnique({
        where: {
            id: req.session.user.id,
        },
    })

    res.json(user)
}

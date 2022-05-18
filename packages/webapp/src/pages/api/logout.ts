import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute } from '@/lib/withSession'

export default withSessionRoute(logoutRoute)

function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
    req.session.destroy()
    res.redirect('/')
}

import { withSessionRoute } from '@/lib/withSession'
import { NextApiRequest, NextApiResponse } from 'next'

export default withSessionRoute(logoutRoute)

function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
    req.session.destroy()
    res.redirect('/')
}

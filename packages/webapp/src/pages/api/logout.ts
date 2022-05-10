import { withSessionRoute } from '@/lib/withSession'
import { NextApiRequest, NextApiResponse } from 'next'

export default withSessionRoute(logoutRoute)

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    req.session.destroy()
    res.json({ isLoggedIn: false, login: '', avatarUrl: '' })
}

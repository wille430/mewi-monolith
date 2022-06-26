import { NextApiRequest, NextApiResponse } from 'next'
import { AuthTokens } from '@wille430/common'
import { withSessionRoute } from '@/lib/withSession'
import { instance } from '@/lib/axios'

export default withSessionRoute(loginRoute)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const { access_token } = req.body as AuthTokens

    const { id, roles } = await instance
        .get('/users/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        .then((res) => res.data)

    // Create iron session
    req.session.user = {
        id,
        roles,
    }

    await req.session.save()

    return res.status(200).send('Success')
}

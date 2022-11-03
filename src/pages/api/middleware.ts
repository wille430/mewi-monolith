import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

const middleware = (req: NextApiRequest, res: NextApiResponse) => {
    return NextResponse.next()
}

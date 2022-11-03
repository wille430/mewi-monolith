import { NextApiRequest, NextApiResponse } from 'next'
import { Catch } from 'next-api-decorators'
import { NextResponse } from 'next/server'
import { exceptionHandler } from '@/lib/errors/exceptionHandler'

const middleware = (req: NextApiRequest, res: NextApiResponse) => {
    return NextResponse.next()
}

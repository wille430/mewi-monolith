import { NextApiRequest, NextApiResponse } from 'next'

const resftulHandler = (methods: {
    [key: string]: (req: NextApiRequest, res: NextApiResponse) => any
}) => {
    return (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method) {
            if (methods[req.method.toLowerCase()]) {
                methods[req.method.toLowerCase()](req, res)
            } else {
                res.status(405).json({
                    error: {
                        message: 'Method not allowed',
                    },
                })
            }
        } else {
            res.status(405).json({
                error: {
                    message: 'Missing method',
                },
            })
        }
    }
}

export default resftulHandler

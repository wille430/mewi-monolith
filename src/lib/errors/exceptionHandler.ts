import { NextApiRequest, NextApiResponse } from "next";
import {BadRequestException} from 'next-api-decorators'

export const exceptionHandler = (error: unknown, req: NextApiRequest, res: NextApiResponse) => {
    throw new BadRequestException(error as any)
}
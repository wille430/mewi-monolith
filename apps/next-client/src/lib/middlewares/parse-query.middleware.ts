import { NextApiRequest, NextApiResponse } from "next";
import { NextFunction } from "next-api-decorators";

export const parseQueryMiddleware = (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextFunction
) => {
    req.query ??= {};
    return next();
};

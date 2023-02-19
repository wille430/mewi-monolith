import {NextApiRequest, NextApiResponse} from "next";
import {createMiddlewareDecorator, NextFunction} from "next-api-decorators";
import {getSession} from "../session/getSession";

export const OptionalSessionGuard = createMiddlewareDecorator(
    async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
        const session = await getSession(req, res);

        if (!session.user && process.env.NODE_ENV !== "production") {
            session.user = req.session?.user;
        } else {
            req.session = session;
        }

        next();
    }
);

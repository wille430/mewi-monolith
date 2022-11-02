import {
    createMiddlewareDecorator,
    Middleware,
    NextFunction,
    UnauthorizedException,
} from 'next-api-decorators'

export const AnyGuard = (...middlewares: Middleware[]) => {
    return createMiddlewareDecorator(
        async (req: any, res: any, next: NextFunction) => {
            let i = 0

            for (const f of middlewares) {
                try {
                    await f(req, res, () => {
                        i += 1
                    })
                    // eslint-disable-next-line no-empty
                } catch (e) {}
            }

            if (i > 0) {
                next()
            } else {
                throw new UnauthorizedException()
            }
        }
    )()
}

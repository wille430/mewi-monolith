declare namespace Express {
    interface AuthenticatedRequest extends Request {
        user?: {
            user_id: string,
            email: string
        }
    }
}
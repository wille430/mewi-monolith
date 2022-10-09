declare module 'http' {
    interface IncomingMessage {
        user?: IUser
        cookies: NextApiRequestCookies
    }
}

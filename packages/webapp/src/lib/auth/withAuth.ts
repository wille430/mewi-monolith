import type { Role } from '@wille430/common'
import type { GetServerSideProps } from 'next'
import { ON_UNAUTHENTICATED_GOTO } from '@/constants/paths'
import { withSessionSsr } from '@/backend/lib/session/withSessionSsr'

export const withAuth = (handler: GetServerSideProps, allowedRoles: Role[]): GetServerSideProps => {
    return withSessionSsr(async (context) => {
        const { req } = context
        const roles = req.session.user?.roles

        if (!roles) {
            return {
                redirect: {
                    destination: ON_UNAUTHENTICATED_GOTO,
                    permanent: false,
                },
            }
        }

        if (allowedRoles && !allowedRoles.some((x) => roles.includes(x))) {
            // redirect
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }

        return handler(context)
    })
}

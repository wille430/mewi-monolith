import type { Role } from '@wille430/common'
import type { GetServerSideProps } from 'next'
import { withUser } from './withUser'
import { ON_UNAUTHENTICATED_GOTO } from '@/constants/paths'

export const withAuth = (handler: GetServerSideProps, allowedRoles: Role[]): GetServerSideProps => {
    return withUser(async (context) => {
        const { req } = context
        const { roles } = req?.user ?? {}

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

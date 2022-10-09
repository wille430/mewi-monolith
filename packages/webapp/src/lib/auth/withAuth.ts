import { ON_UNAUTHENTICATED_GOTO } from '@/constants/paths'
import { Role } from '@wille430/common'
import { GetServerSideProps } from 'next'
import { withUser } from './withUser'

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

import type {GetServerSideProps} from "next";
import {UNAUTHORIZED_REDIRECT_TO} from "@/lib/constants/paths";
import {withSessionSsr} from "@/lib/session/withSessionSsr";
import {Role} from "@mewi/models";

export const withAuth = (handler: GetServerSideProps, allowedRoles: Role[]): GetServerSideProps => {
    return withSessionSsr(async (context) => {
        const {req} = context;
        const roles = req.session.user?.roles;

        if (!roles) {
            return {
                redirect: {
                    destination: UNAUTHORIZED_REDIRECT_TO,
                    permanent: false,
                },
            };
        }

        if (allowedRoles && !allowedRoles.some((x) => roles.includes(x))) {
            // redirect
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                },
            };
        }

        return handler(context);
    });
};

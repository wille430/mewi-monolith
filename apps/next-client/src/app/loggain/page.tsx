"use client";
import {EmailSignInForm} from "@/components/EmailSignInForm/EmailSignInForm";
import {useUser} from "@/hooks/useUser";
import {CreateAccountInformation} from "@/components/CreateAccountInformation";
import Link from "next/link";
import {FcGoogle} from "react-icons/fc";

const Login = () => {
    useUser({
        redirectIfFound: true,
        redirectTo: "/minasidor",
    });

    return (
        <main className="p-4">
            <section
                className="divided-content section p-0"
                style={{marginTop: "15vh"}}
            >
                <div className="flex-grow p-4 py-16">
                    <h3 className="mb-8 text-center text-primary">Logga in</h3>

                    <EmailSignInForm/>

                    <Link className="google-btn w-full mt-4" href="/api/auth/google-signin">
                        <FcGoogle/>
                        Logga in med Google
                    </Link>
                </div>
                <CreateAccountInformation/>
            </section>
        </main>
    );
};

export default Login;

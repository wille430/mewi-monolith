"use client";
import {UpdatePasswordForm} from "@/components/UpdatePasswordForm/UpdatePasswordForm";
import {useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useUser} from "@/hooks/useUser";
import {Container} from "@/components/Container/Container";

const EMAIL_KEY = "email";
const TOKEN_KEY = "token";

const ForgottenPassword = () => {
    useUser({
        redirectIfFound: true,
        redirectTo: "/minasidor",
    });

    const router = useRouter();
    const params = useSearchParams();


    useEffect(() => {
        const email = params?.get(EMAIL_KEY);
        const token = params?.get(TOKEN_KEY);
        if (!email || !token) {
            // noinspection JSIgnoredPromiseFromCall
            router.push("/");
        }
    }, []);

    return (
        <main>
            <Container
                className="mx-auto max-w-lg"
                style={{
                    marginTop: "15vh",
                }}
            >
                <Container.Header>
                    <h3 className="pb-6 pt-4 text-center">Nytt lösenord</h3>
                </Container.Header>
                <Container.Content>
                    <UpdatePasswordForm
                        initialValues={{
                            email: params?.get(EMAIL_KEY) as string,
                            token: params?.get(TOKEN_KEY) as string,
                        }}
                    />
                </Container.Content>
                <Container.Footer>
                    <div className="pt-6"></div>
                </Container.Footer>
            </Container>
        </main>
    );
};

export default ForgottenPassword;

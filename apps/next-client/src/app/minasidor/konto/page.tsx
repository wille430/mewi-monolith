"use client";
import Head from "next/head";
import AccountDetails from "@/components/AccountDetails/AccountDetails";
import {Container} from "@/components/Container/Container";
import {HorizontalLine} from "@/components/HorizontalLine/HorizontalLine";
import {useAppSelector} from "@/hooks";

const Konto = () => {

    // user is never null on this page because of hoc used in layout under /minasidor
    const {user} = useAppSelector(state => state.user);

    return (
        <>
            <Head>
                <title>Mitt konto</title>
            </Head>

            <main>
                <Container
                    style={{
                        minHeight: "50vh",
                    }}
                >
                    <Container.Header>
                        <h3>Mitt Konto</h3>
                        <HorizontalLine/>
                    </Container.Header>

                    <Container.Content>
                        <AccountDetails user={user!}/>
                    </Container.Content>
                    <Container.Footer></Container.Footer>
                </Container>
            </main>
        </>
    );
};

export default Konto;

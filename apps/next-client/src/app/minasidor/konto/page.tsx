"use client";
import Head from "next/head";
import AccountDetails from "@/components/AccountDetails/AccountDetails";
import {HorizontalLine} from "@/components/HorizontalLine/HorizontalLine";
import {useAppSelector} from "@/hooks";
import {withAuthorized} from "@/hocs/withAuthorized";

const Konto = () => {

    // user is never null on this page because of hoc used in layout under /minasidor
    const {user} = useAppSelector(state => state.user);

    return (
        <>
            <Head>
                <title>Mitt konto</title>
            </Head>

            <main>
                <section
                    style={{
                        minHeight: "50vh",
                    }}
                >
                    <div>
                        <h3>Mitt Konto</h3>
                        <HorizontalLine/>
                    </div>

                    <div>
                        <AccountDetails user={user!}/>
                    </div>
                </section>
            </main>
        </>
    );
};

export default withAuthorized(Konto);

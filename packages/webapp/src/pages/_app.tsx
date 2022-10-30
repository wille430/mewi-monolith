import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import type { ReactElement, ReactNode } from 'react'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import '@/styles/globals.scss'
import { SWRConfig } from 'swr'
import { useStore } from 'react-redux'
import type { Store } from '@/store'
import { wrapper } from '@/store'
import { fetchJson } from '@/lib/fetchJson'
import { client } from '@/lib/client'
import { useUser } from '@/hooks/useUser'

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
    pageProps: AppProps['pageProps']
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page) => page)

    const [queryClient] = useState(() => new QueryClient())
    const store = useStore() as Store

    useUser()

    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        window.store = store
        window.axios = client
    }

    return (
        <>
            <Head>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta name='theme-color' content='#000000' />
                <meta name='description' content='Web site created using create-react-app' />
                <meta charSet='utf-8' />
                <meta
                    name='google-signin-client_id'
                    content='988378722186-sad5450gog2mdrlef5jrd8ohii22om24.apps.googleusercontent.com'
                ></meta>
            </Head>
            <SWRConfig
                value={{
                    fetcher: fetchJson,
                    onError: (err) => console.log(err),
                }}
            >
                <QueryClientProvider client={queryClient}>
                    {getLayout(<Component {...pageProps} />)}
                </QueryClientProvider>
            </SWRConfig>
        </>
    )
}

export default wrapper.withRedux(MyApp)

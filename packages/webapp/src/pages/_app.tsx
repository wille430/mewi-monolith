import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement, ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import '@/styles/globals.scss'
import { Store, wrapper } from '@/store'
import { setupAxios } from '@/lib/axios'
import { checkLoggedInStatus } from '@/lib/session'
import { SWRConfig } from 'swr'
import { fetchJson } from '@/lib/fetchJson'

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
    pageProps: AppProps['pageProps'] & {
        initialReduxState: any
    }
    store: Store
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page) => page)
    const [queryClient] = useState(() => new QueryClient())

    setupAxios()
    checkLoggedInStatus()

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

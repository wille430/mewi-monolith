import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'
import '@/styles/app.scss'
import { SWRConfig } from 'swr'
import { Provider } from 'react-redux'
import { wrapper } from '@/lib/store'
import { fetchJson } from '@/lib/fetchJson'
import { client } from '@/lib/client'

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
    pageProps: AppProps['pageProps']
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page) => page)
    const { store } = wrapper.useWrappedStore({ pageProps })

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
            <Provider store={store}>
                <SWRConfig
                    value={{
                        fetcher: fetchJson,
                    }}
                >
                    {getLayout(<Component {...pageProps} />)}
                </SWRConfig>
            </Provider>
        </>
    )
}

export default MyApp

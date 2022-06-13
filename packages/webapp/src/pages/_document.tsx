import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang='sv'>
            <Head>
                <script
                    id='Cookiebot'
                    src='https://consent.cookiebot.com/uc.js'
                    data-cbid='98829f14-dfdb-45c2-b41b-a5a6a33b18d6'
                    data-blockingmode='auto'
                    type='text/javascript'
                ></script>
                <script
                    async
                    src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9261287125223472'
                    crossOrigin='anonymous'
                ></script>
                <script src='https://apis.google.com/js/platform.js' async defer></script>

                <link rel='icon' href='/favicon.ico' />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

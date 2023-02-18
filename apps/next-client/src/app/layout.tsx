import {HTMLAttributes} from "react"
import {client} from "@/client"
import Providers from "@/app/providers"
import "../styles/app.scss"
import "./Nav.module.scss"
import {Footer} from "@/app/Footer"
import {Nav} from "@/app/Nav"

export const metadata = {
    viewport: "width=device-width, initial-scale=1",
    themeColor: "#ffffff",
    description: "Web site created using create-react-app",
    "google-signin-client_id": "988378722186-sad5450gog2mdrlef5jrd8ohii22om24.apps.googleusercontent.com",
    charSet: "utf-8",
    icon: "/facivon.ico"
}

const RootLayout = ({children}: HTMLAttributes<HTMLDivElement>) => {

    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        window.axios = client
    }

    return (
        <html lang="sv">
        <script
            id="Cookiebot"
            src="https://consent.cookiebot.com/uc.js"
            data-cbid="98829f14-dfdb-45c2-b41b-a5a6a33b18d6"
            data-blockingmode="auto"
            type="text/javascript"
        ></script>
        <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9261287125223472"
            crossOrigin="anonymous"
        ></script>
        <script src="https://apis.google.com/js/platform.js" async defer></script>

        <body>
        <Providers>
            <header>
                <Nav/>
            </header>
            {children}
            <Footer/>
        </Providers>

        </body>
        </html>
    )
}

export default RootLayout
"use client"
import {HTMLAttributes} from "react"
import {SWRConfig} from "swr"
import {fetchJson} from "@/lib/fetchJson"
import {ReduxProvider} from "@/context/ReduxProvider"

const Providers = ({children}: HTMLAttributes<any>) => {
    return (
        <ReduxProvider>
            <SWRConfig
                value={{
                    fetcher: fetchJson,
                }}
            >
                {children}
            </SWRConfig>
        </ReduxProvider>
    )
}

export default Providers
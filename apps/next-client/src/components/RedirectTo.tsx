import {useEffect} from "react"
import Router from "next/router"

export const RedirectTo = ({to}: { to: string }) => {
    useEffect(() => {
        Router.push(to).then()
    }, [])

    return null
}
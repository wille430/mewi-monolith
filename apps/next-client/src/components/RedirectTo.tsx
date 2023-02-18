import {useEffect} from "react"
import {useRouter} from "next/navigation"

export const RedirectTo = ({to}: { to: string }) => {
    const router = useRouter()

    useEffect(() => {
        router.push(to)
    }, [])

    return null
}
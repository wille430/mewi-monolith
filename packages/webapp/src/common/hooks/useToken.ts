import { useEffect, useState } from "react"

const useToken = () => {

    const getToken = async (): Promise<void> => {
        const tokenString = sessionStorage.getItem('token')
        const userToken = tokenString

        setToken(userToken)
    }

    const saveToken = (userToken: string | null): void => {
        if (!userToken) {
            sessionStorage.removeItem('token')
            setToken(null)
            return
        }
        console.log({userToken})
        sessionStorage.setItem('token', userToken)
        setToken(userToken)
    }
    
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        getToken()
    }, [])

    return {
        token,
        setToken: saveToken
    };
}

export default useToken;
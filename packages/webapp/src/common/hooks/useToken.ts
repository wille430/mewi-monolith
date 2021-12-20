import { useEffect, useState } from "react"

const useToken = (name = 'token') => {

    const getToken = async (): Promise<void> => {
        const tokenString = localStorage.getItem(name)
        const userToken = tokenString
        
        userToken ? setToken(userToken) : setToken(undefined)
    }

    const saveToken = (userToken?: string): void => {
        if (!userToken) {
            localStorage.removeItem(name)
            setToken(undefined)
            return
        }
        console.log({ userToken })
        localStorage.setItem(name, userToken)
        setToken(userToken)
    }

    const [token, setToken] = useState<string | undefined>()

    useEffect(() => {
        getToken()

        window.addEventListener('storage', () => {
            getToken()
        })
    }, [])

    return {
        token,
        setToken: saveToken
    };
}

export default useToken;
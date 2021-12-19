import useToken from "common/hooks/useToken";
import { apiEndpoints } from "config/config";
import React, { createContext, useEffect } from "react";
import axios from 'axios'

interface Props {
    children: React.ReactNode
}

interface State {
    logIn: Function,
    logOut: Function,
    register: Function,
    token: string | null
}

const initialState: State = {
    logIn: (username: string, password: string) => { },
    logOut: () => { },
    register: () => { },
    token: ''
}

export const UserContext = createContext(initialState)

export const UserProvider = ({ children }: Props): any | null => {

    const { token, setToken } = useToken()

    const logIn = async (email: string, password: string): Promise<void> => {
        const res = await fetch(process.env.NX_API_URL + apiEndpoints.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })

        if (res.ok) {
            setToken(await res.text())
        } else {
            throw await res.json()
        }
    }

    const logOut = () => {
        setToken(null)
    }

    const register = async ({ email, password, repassword }: { [key: string]: string }) => {
        await fetch(process.env.NX_API_URL + apiEndpoints.signUp, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, repassword })
        }).then(async res => {
            if (res.ok) {
                setToken(await res.text())
            } else {
                throw await res.json()
            }
        })
    }

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }, [token])

    return (
        <UserContext.Provider value={{
            logIn,
            logOut,
            register,
            token
        }}>
            {children}
        </UserContext.Provider>
    )
}


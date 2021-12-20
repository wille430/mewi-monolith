import useToken from "common/hooks/useToken";
import { apiEndpoints } from "config/config";
import React, { createContext, useEffect } from "react";
import axios from 'axios'
import { login, signUp } from "api";

interface Props {
    children: React.ReactNode
}

interface State {
    logIn: Function,
    logOut: Function,
    register: Function,
    token?: string,
    refreshToken?: string
}

const initialState: State = {
    logIn: (username: string, password: string) => { },
    logOut: () => { },
    register: () => { },
}

export const UserContext = createContext(initialState)

export const UserProvider = ({ children }: Props): any | null => {

    const { token, setToken } = useToken()
    const refreshTokenHook = useToken('refreshToken')
    const [refreshToken, setRefreshToken] = [refreshTokenHook.token, refreshTokenHook.setToken]

    const logIn = async (email: string, password: string): Promise<void> => {
        const { token, refreshToken } = await login(email, password).catch(e => { throw e })

        if (token) {
            setToken(token)
        }
        if (refreshToken) {
            setRefreshToken(refreshToken)
        }
    }

    const logOut = () => {
        setToken()
        setRefreshToken()
    }

    const register = async ({ email, password, repassword }: { [key: string]: string }) => {
        const { token, refreshToken } = await signUp(email, password, repassword)

        if (token) {
            setToken(token)
        }
        if (refreshToken) {
            setRefreshToken(refreshToken)
        }
    }

    return (
        <UserContext.Provider value={{
            logIn,
            logOut,
            register,
            token,
            refreshToken
        }}>
            {children}
        </UserContext.Provider>
    )
}


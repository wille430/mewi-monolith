import axios from 'axios'
import { AuthTokens } from '@mewi/types'

export const login = async (email: string, password: string): Promise<AuthTokens> => {
    const authTokens: AuthTokens = await axios
        .post('/auth/login', { email, password })
        .then((res) => res.data)
    return authTokens
}

export const signUp = async (
    email: string,
    password: string,
    repassword: string
): Promise<AuthTokens> => {
    const authTokens: AuthTokens = await axios
        .post('/auth/signup', { email, password, repassword })
        .then((res) => res.data)
    return authTokens
}

export const refreshJwtToken = async (oldRefreshToken: string): Promise<AuthTokens> => {
    const authTokens = await axios
        .post('/auth/refreshtoken', { refreshToken: oldRefreshToken })
        .then((res) => res.data)

    return authTokens
}

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
    console.log('Creating user with credentials:', email, password, repassword)

    const authTokens: AuthTokens = await axios
        .post('/auth/signup', { email, password, repassword })
        .then((res) => res.data)
    return authTokens
}

export const refreshJwtToken = async (oldRefreshToken?: string | null): Promise<AuthTokens> => {
    const authTokens = await axios
        .post('/auth/refreshtoken', { refreshToken: oldRefreshToken })
        .then((res) => res.data)

    return authTokens
}

export const changePassword = async (
    userId: string,
    password: string,
    repassword: string,
    token: string
): Promise<void> => {
    await axios.put('/auth/password', {
        userId,
        token,
        newPassword: password,
        passwordConfirm: repassword,
    })
}

export default {
    login,
    signUp,
    refreshJwtToken,
    changePassword,
}

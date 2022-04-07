import axios from 'axios'
import { AuthTokens } from '@wille430/common/types'

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
        .post('/auth/token', { refresh_token: oldRefreshToken })
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
    signUp,
    refreshJwtToken,
    changePassword,
}

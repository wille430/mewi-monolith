import axios from "axios"

export const login = async (email: string, password: string) => {
    const { token, refreshToken } = await axios.post('/auth/login', { email, password })
        .then(res => res.data)
    return {
        token,
        refreshToken
    }
}

export const signUp = async (email: string, password: string, repassword: string) => {
    const { token, refreshToken } = await axios.post('/auth/signup', { email, password, repassword })
        .then(res => res.data)
    return {
        token,
        refreshToken
    }
}

export const refreshJwtToken = async (oldRefreshToken: string) => {
    const { token, refreshToken } = await axios.post('/auth/refreshtoken', { refreshToken: oldRefreshToken })
        .then(res => res.data)

    return {
        token,
        refreshToken
    }
}
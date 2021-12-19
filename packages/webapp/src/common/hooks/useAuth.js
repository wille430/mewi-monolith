import { useState } from 'react';

const useAuth = () => {
    const getToken = () => {
        const tokenString = localStorage.getItem('userToken')
        const userToken = tokenString
        return userToken
    }

    const [token, setToken] = useState(getToken())

    const saveToken = token => {
        if (!token) {
            return
        }
        localStorage.setItem('userToken', token)
        setToken(token)
    }

    return {
        setToken: saveToken,
        token,
    };
}

export default useAuth;
const isProduction = process.env.NODE_ENV === 'production'

export interface EnvVars {
    API_URL: string
    CLIENT_URL: string
}

export default (): EnvVars => {
    if (isProduction) {
        return {
            API_URL: 'https://mewi.se/api',
            CLIENT_URL: 'https://mewi.se',
        }
    } else {
        return {
            API_URL: 'http://localhost:3000/api',
            CLIENT_URL: 'http://localhost:3000',
        }
    }
}

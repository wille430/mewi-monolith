const isProduction = process.env.NODE_ENV === 'production'

export interface EnvVars {
    API_URL: string
}

export default (): EnvVars => {
    if (isProduction) {
        return {
            API_URL: 'https://api.mewi.se',
        }
    } else {
        return {
            API_URL: 'http://localhost:3001',
        }
    }
}

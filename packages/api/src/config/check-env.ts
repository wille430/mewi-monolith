const checkEnv = () => {
    const envs = {
        required: [
            'MONGO_URI',
            'TOKEN_KEY',
            'SEARCH_ENGINE_URL',
            'SEARCH_ENGINE_PORT',
            'GMAIL_MAIL',
            'GMAIL_PASS',
        ],
        optional: ['API_ADMIN_USERNAME', 'API_ADMIN_PASSWORD', 'MONGO_USERNAME', 'MONGO_PASSWORD'],
    }

    // Check required envs
    const missingRequired = []
    envs.required.forEach((env) => {
        if (!process.env[env]) missingRequired.push(env)
    })

    if (missingRequired.length > 0) {
        console.error(`Missing required enviromental variables ${missingRequired.join(', ')}`)
    }

    // Check optional envs
    const missingOptional = []
    envs.optional.forEach((env) => {
        if (!process.env[env]) missingOptional.push(env)
    })

    if (missingOptional.length > 0) {
        console.warn(`Missing optional enviromental variables ${missingOptional.join(', ')}`)
    }
}

export default checkEnv

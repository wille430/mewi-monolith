import { registerAs } from '@nestjs/config'

const isProduction = process.env.NODE_ENV === 'production'

type DatabaseConfig = {
    uri: string
}

const { MONGO_URI, MONGO_USERNAME, MONGO_PASSWORD } = process.env
export default registerAs('database', (): DatabaseConfig => {
    if (isProduction) {
        return {
            uri:
                MONGO_USERNAME && MONGO_PASSWORD
                    ? `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_URI}`
                    : `mongodb://${MONGO_URI || '127.0.0.1'}`,
        }
    } else {
        return {
            uri: 'mongodb://127.0.0.1',
        }
    }
})

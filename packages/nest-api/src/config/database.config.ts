import { registerAs } from '@nestjs/config'

type DatabaseConfig = {
    uri?: string
}

export default registerAs(
    'database',
    (): DatabaseConfig => ({
        uri:
            process.env.NODE_ENV === 'test'
                ? process.env.DATABASE_TEST_URI
                : process.env.DATABASE_URI,
    })
)

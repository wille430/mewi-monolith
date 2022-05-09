import { registerAs } from '@nestjs/config'

type DatabaseConfig = {
    uri: string
}

export default registerAs(
    'database',
    (): DatabaseConfig => ({
        uri: process.env.DATABASE_URL || 'mongodb://localhost:27017/test',
    })
)

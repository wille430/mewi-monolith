import { seedDb } from '@mewi/test-utils'
import { exit } from 'process'
import { dbConnection } from '../backend/lib/dbConnection'

dbConnection().then(async (db) => {
    await seedDb(db)
    exit(0)
})

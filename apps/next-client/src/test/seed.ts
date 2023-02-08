import { dbConnection } from '@/lib/dbConnection'
import { exit } from 'process'
import { seedDb } from './seed'

dbConnection().then(async (db) => {
    await seedDb(db)
    exit(0)
})

import { exit } from 'process'
import { dbConnection } from '../backend/lib/dbConnection'

const COLLECTIONS = ['users', 'listings']

const clearDb = async () => {
    const db = await dbConnection().then(({ db }) => db)
    for (let i = 0; i < COLLECTIONS.length; i++) {
        const collectionName = COLLECTIONS[i]
        await db.collection(collectionName).deleteMany({})
    }

    exit(0)
}

clearDb()

export {}

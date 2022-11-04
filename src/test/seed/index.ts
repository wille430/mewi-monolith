import { Connection } from 'mongoose'
import { seedListings } from './seedListings'
import { seedUsers } from './seedUsers'

export const USER_COUNT = 10
export const LISTING_COUNT = 50

export * from './seedListings'
export * from './seedUsers'

export const seedDb = async (connection: Connection) => {
    const db = connection.db
    return Promise.all([seedUsers(USER_COUNT, db), seedListings(LISTING_COUNT, db)])
}

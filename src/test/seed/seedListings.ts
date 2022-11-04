import { IListing } from '@/common/schemas'
import { createFakeListing } from '@/common/test/factories/createFakeListing'
import { Db } from 'mongodb'
import { seedWith } from './seedWith'

export const seedListings = async (count: number, db: Db) =>
    seedWith(count, db.collection<IListing>('listings'), createFakeListing)

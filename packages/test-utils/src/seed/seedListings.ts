import { IListing } from '@wille430/common'
import { createFakeListing } from 'factory'
import { Db } from 'mongodb'
import { seedWith } from './seedWith'

export const seedListings = async (count: number, db: Db) =>
    seedWith(count, db.collection<IListing>('listings'), createFakeListing)

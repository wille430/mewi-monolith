import { IUser } from '@wille430/common'
import { createFakeUser } from 'factory'
import { Db } from 'mongodb'
import { seedWith } from './seedWith'

export const seedUsers = async (count: number, db: Db) =>
    seedWith(count, db.collection<IUser>('users'), createFakeUser)

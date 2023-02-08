import { IUser } from '@/common/schemas'
import { createFakeUser } from '@/common/test/factories/createFakeUser'
import { Db } from 'mongodb'
import { seedWith } from './seedWith'

export const seedUsers = async (count: number, db: Db) =>
    seedWith(count, db.collection<IUser>('users'), createFakeUser)

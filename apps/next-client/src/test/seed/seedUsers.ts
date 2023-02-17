import { createFakeUser } from '@/common/test/factories/createFakeUser'
import { Db } from 'mongodb'
import { seedWith } from './seedWith'
import {UserDto} from "@mewi/models"

export const seedUsers = async (count: number, db: Db) =>
    seedWith(count, db.collection<UserDto>('users'), createFakeUser)

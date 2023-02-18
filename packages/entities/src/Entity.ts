import {ObjectId} from "mongoose"

export class Entity {
    _id!: ObjectId
    createdAt!: Date
    updatedAt!: Date
}
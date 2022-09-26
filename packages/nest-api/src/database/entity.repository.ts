import mongoose, { Document, FilterQuery, Model, UpdateQuery } from 'mongoose'

export abstract class EntityRepository<T extends Document> {
    defaultProjection = {
        __v: 0,
    }
    constructor(protected readonly entityModel: Model<T>) {}

    async findOne(
        entityFilterQuery: FilterQuery<T>,
        projection?: Record<string, unknown>
    ): Promise<T | null> {
        return this.entityModel
            .findOne(entityFilterQuery, {
                ...this.defaultProjection,
                ...projection,
            })
            .exec()
    }

    async findById(id: string, projection?: Record<string, unknown>): Promise<T | null> {
        return this.entityModel
            .findById(id, {
                ...this.defaultProjection,
                ...projection,
            })
            .exec()
    }

    async find(entityFilterQuery: FilterQuery<T>): Promise<T[] | null> {
        return this.entityModel.find(entityFilterQuery)
    }

    async create(createEntityData: unknown): Promise<T> {
        const entity = new this.entityModel(createEntityData)
        return entity.save()
    }

    async findByIdAndUpdate(id: string, updateEntityData: UpdateQuery<T>): Promise<T | null> {
        return this.entityModel.findByIdAndUpdate(id, updateEntityData, {
            new: true,
        })
    }

    async findOneAndUpdate(
        entityFilterQuery: FilterQuery<T>,
        updateEntityData: UpdateQuery<unknown>
    ): Promise<T | null> {
        return this.entityModel.findOneAndUpdate(entityFilterQuery, updateEntityData, {
            new: true,
        })
    }

    async findByIdAndDelete(id: string): Promise<T | null> {
        return this.entityModel.findByIdAndDelete(id)
    }

    async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<boolean> {
        const deleteResult = await this.entityModel.deleteMany(entityFilterQuery)
        return deleteResult.deletedCount >= 1
    }

    async count(entityFilterQuery: FilterQuery<T>): Promise<number> {
        return this.entityModel.countDocuments(entityFilterQuery)
    }
}

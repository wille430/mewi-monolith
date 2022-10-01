import { UpdateResult } from 'mongodb'
import mongoose, {
    Document,
    FilterQuery,
    HydratedDocument,
    Model,
    Query,
    UpdateQuery,
} from 'mongoose'
import { Pagination } from './dto/pagination.dto'

export abstract class EntityRepository<T extends Document> {
    defaultProjection = {
        __v: 0,
    }
    constructor(protected readonly entityModel: Model<T>) {}

    private async applyPagination(
        pagination: Pagination,
        query: Query<
            HydratedDocument<T, {}, {}> | HydratedDocument<T, {}, {}>[] | null,
            HydratedDocument<T, {}, {}>
        >
    ) {
        pagination?.skip && query.skip(pagination.skip)

        pagination?.limit && query.limit(pagination.limit)

        return query
    }

    async findOne(
        entityFilterQuery: FilterQuery<T>,
        pagination?: Pagination,
        projection?: Record<string, unknown>
    ): Promise<T | null> {
        const query = this.entityModel.findOne(entityFilterQuery, {
            ...this.defaultProjection,
            ...projection,
        })

        pagination && this.applyPagination(pagination, query)

        return query.exec()
    }

    async findById(
        id: string,
        pagination?: Pagination,
        projection?: Record<string, unknown>
    ): Promise<T | null> {
        const query = this.entityModel.findById(id, {
            ...this.defaultProjection,
            ...projection,
        })

        pagination && this.applyPagination(pagination, query)

        return query.exec()
    }

    async find(entityFilterQuery: FilterQuery<T>, pagination?: Pagination): Promise<T[] | null> {
        const query = this.entityModel.find(entityFilterQuery)

        pagination && this.applyPagination(pagination, query)

        return query.exec()
    }

    async create(createEntityData: unknown): Promise<T> {
        const entity = new this.entityModel(createEntityData)
        const id = entity.id
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

    async updateMany(
        entityFilterQuery: FilterQuery<T>,
        updateEntityData: UpdateQuery<T>
    ): Promise<UpdateResult> {
        return this.entityModel.updateMany(entityFilterQuery, updateEntityData)
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

    aggregate = this.entityModel.aggregate
}

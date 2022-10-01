import { AggregateOptions, UpdateResult } from 'mongodb'
import {
    Document,
    FilterQuery,
    HydratedDocument,
    Model,
    PipelineStage,
    Query,
    UpdateQuery,
} from 'mongoose'
import { Pagination } from './dto/pagination.dto'

export abstract class EntityRepository<T extends Document> {
    defaultProjection = {
        __v: 0,
    }
    constructor(protected readonly entityModel: Model<T>) {}

    private applyPagination<
        R extends Query<
            HydratedDocument<T, {}, {}> | HydratedDocument<T, {}, {}>[] | null,
            HydratedDocument<T, {}, {}> | HydratedDocument<T, {}, {}>[] | null
        >
    >(pagination: Pagination, query: R): R {
        pagination?.skip && query.skip(pagination.skip)

        pagination?.limit && query.limit(pagination.limit)

        return query
    }

    async findOne(
        entityFilterQuery: FilterQuery<T>,
        pagination: Pagination = {},
        projection?: Record<string, unknown>
    ): Promise<T | null> {
        return this.applyPagination(
            pagination,
            this.entityModel.findOne(entityFilterQuery, {
                ...this.defaultProjection,
                ...projection,
            })
        ).exec()
    }

    async findById(
        id: string,
        pagination: Pagination = {},
        projection?: Record<string, unknown>
    ): Promise<T | null> {
        return this.applyPagination(
            pagination,
            this.entityModel.findById(id, {
                ...this.defaultProjection,
                ...projection,
            })
        ).exec()
    }

    async find(entityFilterQuery: FilterQuery<T>, pagination: Pagination): Promise<T[] | null> {
        return this.applyPagination(
            pagination,
            this.entityModel.find(entityFilterQuery, {
                ...this.defaultProjection,
            })
        ).exec()
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

    async aggregate(pipeline: PipelineStage[], options: AggregateOptions = {}) {
        return this.entityModel.aggregate(pipeline, options)
    }

    async sample(count: number) {
        const totalDocs = await this.entityModel.count({})

        const randomNums = Array.from({ length: Math.min(count, totalDocs) }, () =>
            Math.floor(Math.random() * (totalDocs - 1))
        )

        const randomDocs: T[] = []
        const addedDocNums: number[] = []

        for (const i of randomNums) {
            if (!addedDocNums.includes(i)) {
                const entity = await this.entityModel.findOne({}, { skip: i })

                if (entity) randomDocs.push(entity)
                addedDocNums.push(i)
            }
        }

        return randomDocs
    }
}

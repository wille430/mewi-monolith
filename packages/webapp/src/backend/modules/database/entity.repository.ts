import type { AggregateOptions, UpdateResult } from 'mongodb'
import type {
    Document,
    FilterQuery,
    HydratedDocument,
    Model,
    PipelineStage,
    Query,
    UpdateQuery,
} from 'mongoose'
import type { Pagination } from './dto/pagination.dto'
import { dbConnection } from '@/lib/dbConnection'

export abstract class EntityRepository<T extends Document> {
    defaultProjection = {
        __v: 0,
    }
    constructor(protected readonly entityModel: Model<T>) {
        dbConnection()
    }

    private applyPagination<
        R extends Query<
            HydratedDocument<T, {}, {}> | HydratedDocument<T, {}, {}>[] | null,
            HydratedDocument<T, {}, {}> | HydratedDocument<T, {}, {}>[] | null
        >
    >(pagination: Pagination, query: R): R {
        pagination?.skip && query.skip(pagination.skip)

        pagination?.limit && query.limit(pagination.limit)

        pagination?.sort && query.sort(pagination.sort)

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

    async find(
        entityFilterQuery: FilterQuery<T>,
        pagination: Pagination = {}
    ): Promise<T[] | null> {
        try {
            return this.applyPagination(
                pagination,
                this.entityModel.find(entityFilterQuery, {
                    ...this.defaultProjection,
                })
            ).exec()
        } catch (e) {
            // @ts-ignore
            return this.applyPagination(
                pagination,
                // @ts-ignore
                this.entityModel.find(entityFilterQuery, {
                    ...this.defaultProjection,
                })
            )
        }
    }

    async create(createEntityData: unknown): Promise<T> {
        const entity = new this.entityModel(createEntityData)
        return entity.save()
    }

    async createMany(createEntityData: unknown[]): Promise<{ count: number }> {
        const entities = await Promise.all(createEntityData.map(this.create))

        return {
            count: entities.length,
        }
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
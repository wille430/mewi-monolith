import type {AggregateOptions, UpdateResult} from 'mongodb'
import {Document, FilterQuery, HydratedDocument, Model, PipelineStage, Query, UpdateQuery,} from 'mongoose'
import {dbConnection} from '@/lib/dbConnection'
import {Ref} from '@typegoose/typegoose'
import {IPagination} from "@/lib/modules/filtering/IPagination"
import {ISortable} from "@/lib/modules/filtering/ISortable"

export type PopulationArg<T> = Partial<{
    [P in keyof T]: T[P] extends Ref<any> ? boolean : undefined
}>

export abstract class EntityRepository<T extends Document> {
    defaultProjection = {
        __v: 0,
    }

    protected constructor(protected readonly entityModel: Model<T>) {
        return new Proxy(this, {
            get(target, prop) {
                const method = target[prop]
                if (typeof method === 'function') {
                    return async (...args: any) => {
                        await dbConnection()
                        const res = await method.apply(target, args)
                        return res
                    }
                } else {
                    return Reflect.get(target, prop)
                }
            },
        })
    }

    async setup() {
        await dbConnection()
    }

    private applyPagination<
        R extends Query<
            HydratedDocument<T> | HydratedDocument<T>[] | null,
            HydratedDocument<T> | HydratedDocument<T>[] | null
        >
    >(pagination: IPagination, query: R): R {
        const {page, limit} = pagination
        const skip = page ? (page - 1) * (limit ?? 0) : 0

        query.skip(skip)

        limit != null && query.limit(limit)

        return query
    }


    private applySorting<
        R extends Query<
            HydratedDocument<T> | HydratedDocument<T>[] | null,
            HydratedDocument<T> | HydratedDocument<T>[] | null
        >
    >({sort}: ISortable, query: R): R {
        if (sort) {
            query.sort(sort)
        }
        return query
    }

    async findOne(
        entityFilterQuery: FilterQuery<T>,
        pagination: IPagination = {},
        sorting: ISortable = {},
        projection?: Record<string, unknown>
    ): Promise<T | null> {
        const q = this.entityModel.findOne(entityFilterQuery, {
            ...this.defaultProjection,
            ...projection,
        })
        this.applyPagination(pagination, q)
        this.applySorting(sorting, q)
        return q.exec()
    }

    async findById(
        id: string,
        pagination: IPagination = {},
        projection?: Record<string, unknown>
    ): Promise<T | null> {
        const q = this.entityModel.findById(id, {
            ...this.defaultProjection,
            ...projection,
        })

        this.applyPagination(pagination, q)
        return q.exec()
    }

    async find(
        entityFilterQuery: FilterQuery<T>,
        pagination: IPagination & ISortable = {},
        populate: PopulationArg<T> = {} as any
    ): Promise<T[] | null> {
        const query = this.entityModel.find(entityFilterQuery, {
            ...this.defaultProjection,
        })

        for (const key of Object.keys(populate)) {
            if (populate[key] === true) {
                query.populate(key)
            }
        }

        this.applyPagination(pagination, query)
        this.applySorting(pagination, query)

        return await query.exec()
    }

    async create(createEntityData: unknown): Promise<T> {
        const entity = new this.entityModel(createEntityData)
        return entity.save()
    }

    async createMany(createEntityData: unknown[]): Promise<{ count: number }> {
        const entities = await this.entityModel.create(...createEntityData)

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

    async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<number> {
        const deleteResult = await this.entityModel.deleteMany(entityFilterQuery)
        return deleteResult.deletedCount
    }

    async count(entityFilterQuery: FilterQuery<T>): Promise<number> {
        return this.entityModel.count(entityFilterQuery)
    }

    async aggregate(pipeline: PipelineStage[], options: AggregateOptions = {}): Promise<any> {
        // @ts-ignore
        const agg = this.entityModel.aggregate(pipeline, options) as any
        return await agg
    }

    async sample(count: number) {
        const totalDocs = await this.entityModel.count({})

        const randomNums = Array.from({length: Math.min(count, totalDocs)}, () =>
            Math.floor(Math.random() * (totalDocs - 1))
        )

        const randomDocs: T[] = []
        const addedDocNums: number[] = []

        for (const i of randomNums) {
            if (!addedDocNums.includes(i)) {
                const entity = await this.entityModel.findOne().skip(i).exec()

                if (entity) randomDocs.push(entity)
                addedDocNums.push(i)
            }
        }

        return randomDocs
    }
}

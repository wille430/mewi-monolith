import { Injectable } from '@nestjs/common'
import { Listing, Prisma } from '@mewi/prisma'
import { omit } from 'lodash'
import { ListingSort } from '@wille430/common'
import { EJSON } from 'bson'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'
import { PrismaService } from '@/prisma/prisma.service'

const MIN_SEARCH_SCORE = 1

@Injectable()
export class ListingsService {
    constructor(private prisma: PrismaService) {}

    async create(createListingDto: CreateListingDto): Promise<Listing> {
        const createdListing = await this.prisma.listing.create({
            data: createListingDto,
        })
        return createdListing
    }

    async findAll(dto: FindAllListingsDto) {
        const totalHitsPipeline = this.metadataToPL(omit(dto, 'page', 'limit'))
        const hitsPipeline = this.metadataToPL(dto)

        let totalHits = (await this.prisma.listing.aggregateRaw({
            pipeline: [...totalHitsPipeline, { $count: 'totalHits' }],
        })) as unknown as any[]
        totalHits = totalHits[0]?.totalHits ?? 0

        const hits = await this.prisma.listing
            .aggregateRaw({
                pipeline: [...hitsPipeline],
            })
            .then((arr) => (arr as unknown as any[]).map((x) => EJSON.deserialize(x)))

        return {
            filters: dto,
            totalHits,
            hits,
        }
    }

    metadataToPL(dto: Partial<FindAllListingsDto>): Prisma.InputJsonValue[] {
        const pipeline: Prisma.InputJsonValue[] = []

        if (dto.keyword) {
            pipeline.push()
        }

        const dtoFieldToStageMap: Record<
            keyof typeof dto,
            (value: typeof dto[keyof typeof dto]) => Prisma.InputJsonValue | Prisma.InputJsonValue[]
        > = {
            keyword: (value) => [
                {
                    $search: {
                        index:
                            process.env.NODE_ENV === 'production'
                                ? 'listing_search_prod'
                                : 'listing_search_dev',
                        text: {
                            query: value as string,
                            path: {
                                wildcard: '*',
                            },
                            fuzzy: {},
                        },
                    },
                },
                {
                    $addFields: {
                        score: { $meta: 'searchScore' },
                    },
                },
                { $match: { score: { $gte: MIN_SEARCH_SCORE } } },
            ],
            auction: (value: boolean) => ({ $match: { auction: value } }),
            category: (value: string) => ({ $match: { category: value } }),
            dateGte: (value: Date) => ({ $match: { date: { $gte: value } } } as any),
            priceRangeGte: (value: number) => ({ $match: { 'price.value': { $gte: value } } }),
            priceRangeLte: (value: number) => ({ $match: { 'price.value': { $lte: value } } }),
            region: (value: string) => {
                const regions = value
                    .split(/(\.|,| )? /i)
                    .filter((x) => !!x && !new RegExp(/^,$/).test(x))
                    .map((x) => x.trim())

                return {
                    $match: {
                        region: {
                            $regex: (`^` +
                                regions.map((reg) => '(?=.*\\b' + reg + '\\b)').join('') +
                                '.+') as any,
                            $options: 'i',
                        },
                    },
                }
            },
            sort: (value) => {
                const listingSortToOrderBy: Record<ListingSort, any> = {
                    [ListingSort.DATE_ASC]: {
                        date: 1,
                    },
                    [ListingSort.DATE_DESC]: {
                        date: -1,
                    },
                    [ListingSort.PRICE_ASC]: {
                        'price.value': 1,
                    },
                    [ListingSort.PRICE_DESC]: {
                        'price.value': -1,
                    },
                    [ListingSort.RELEVANCE]: undefined,
                }

                return { $sort: listingSortToOrderBy[value as ListingSort] }
            },
            page: (value: number) => ({
                $skip: (value - 1) * (value ?? 20),
            }),
            limit: (value: number) => ({ $limit: value }),
        }

        for (const [key, value] of Object.entries(dto)) {
            if (value !== undefined) {
                let stage = dtoFieldToStageMap[key](value)
                stage = Array.isArray(stage) ? stage : [stage]

                if (key === 'keyword') {
                    pipeline.unshift(...stage)
                } else {
                    pipeline.push(...stage)
                }
            }
        }

        if (!dto.sort && dto.keyword) {
            pipeline.push({ $sort: { score: -1 } })
        }

        return pipeline
    }

    // metadataToWhereInput(dto: Partial<FindAllListingsDto>): Prisma.ListingFindManyArgs {
    //     const args: Prisma.ListingFindManyArgs & {
    //         where: Prisma.ListingWhereInput & {
    //             OR?: Prisma.ListingWhereInput[]
    //         }
    //     } = {
    //         where: {
    //             OR: [],
    //         },
    //     }

    //     if (dto.page && dto.page > 0) {
    //         args.skip = (dto.page - 1) * (dto.limit ?? 20)
    //     }

    //     const listingSortToOrderBy: Record<ListingSort, Prisma.ListingOrderByWithRelationInput> = {
    //         [ListingSort.DATE_ASC]: {
    //             date: 'asc',
    //         },
    //         [ListingSort.DATE_DESC]: {
    //             date: 'desc',
    //         },
    //         [ListingSort.PRICE_ASC]: {
    //             price: {
    //                 value: 'asc',
    //             },
    //         },
    //         [ListingSort.PRICE_DESC]: {
    //             price: {
    //                 value: 'desc',
    //             },
    //         },
    //         [ListingSort.RELEVANCE]: undefined,
    //     }

    //     if (dto.sort !== ListingSort.RELEVANCE) {
    //         args.orderBy = {
    //             ...listingSortToOrderBy[dto.sort],
    //         }
    //     }

    //     if (dto.priceRangeGte) {
    //         args.where = merge(args.where, {
    //             price: {
    //                 is: { value: { gte: dto.priceRangeGte } },
    //             },
    //         })
    //     }

    //     if (dto.priceRangeLte) {
    //         args.where = merge(args.where, {
    //             price: {
    //                 is: { value: { lte: dto.priceRangeLte } },
    //             },
    //         })
    //     }

    //     for (const key in dto) {
    //         const value = dto[key]
    //         if (!value) continue
    //         switch (key as keyof typeof dto) {
    //             case 'keyword':
    //                 args.where.title = {
    //                     mode: 'insensitive',
    //                     contains: value,
    //                 }
    //                 break
    //             case 'region':
    //                 args.where.OR.push({
    //                     region: {
    //                         contains: value,
    //                         mode: 'insensitive',
    //                     },
    //                 })
    //                 break
    //             case 'category':
    //                 args.where.category = value
    //                 break
    //             case 'auction':
    //                 args.where.isAuction = value
    //                 break
    //             case 'dateGte':
    //                 args.where.date = {
    //                     gte: new Date(value),
    //                 }
    //                 break
    //         }
    //     }

    //     // Remove unnecessary keys
    //     if (!args.where.OR.length) args.where = _.omit(args.where, 'OR')

    //     return args
    // }

    async findOne(id: string) {
        return await this.prisma.listing.findUnique({ where: { id } })
    }

    async update(id: string, updateListingDto: UpdateListingDto): Promise<Listing> {
        const updatedListing = await this.prisma.listing.update({
            where: { id },
            data: updateListingDto,
        })
        return updatedListing
    }

    async remove(id: string) {
        await this.prisma.listing.delete({ where: { id } })
    }

    async sample(count = 1) {
        const totalDocs = await this.prisma.listing.count()

        const randomNums = Array.from({ length: count }, () =>
            Math.floor(Math.random() * totalDocs)
        )

        const randomDocs: Listing[] = []
        const addedDocNums: number[] = []

        for (const i of randomNums) {
            if (!addedDocNums.includes(i)) {
                const listing = await this.prisma.listing.findFirst({ skip: i })

                if (listing) randomDocs.push()
                addedDocNums.push(i)
            }
        }

        return randomDocs
    }

    async autocomplete(keyword: string): Promise<string[]> {
        const response = await this.prisma.listing.findMany({
            where: {
                title: {
                    contains: keyword,
                },
            },
            take: 5,
        })

        return response.map((x) => x.title)
    }

    async deleteMany(dto: Prisma.ListingDeleteManyArgs) {
        return await this.prisma.listing.deleteMany(dto)
    }

    async like(userId: string, listingId: string) {
        // Check if user already has liked the listing
        const listing = await this.prisma.listing.findUnique({ where: { id: listingId } })

        if (listing.likedByUserIDs.includes(userId)) {
            return listing
        } else {
            return await this.prisma.listing.update({
                where: {
                    id: listingId,
                },
                data: {
                    likedByUserIDs: {
                        push: userId,
                    },
                },
            })
        }
    }

    async unlike(userId: string, listingId: string) {
        // Check if user already has liked the listing
        const listing = await this.prisma.listing.findUnique({ where: { id: listingId } })
        const likedByUserIDs = listing.likedByUserIDs.filter((x) => x != userId)

        return await this.prisma.listing.update({
            where: {
                id: listingId,
            },
            data: {
                likedByUserIDs,
            },
        })
    }
}

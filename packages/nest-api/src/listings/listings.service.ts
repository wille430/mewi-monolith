import { Injectable } from '@nestjs/common'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'
import { PrismaService } from '@/prisma/prisma.service'
import { Listing, Prisma } from '@mewi/prisma'
import _ from 'lodash'
import { ListingSort } from '@wille430/common'

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
        const args = this.metadataToWhereInput(dto)

        // TODO: fix sort

        return {
            filters: dto,
            totalHits: await this.prisma.listing.count({
                where: args.where,
            }),
            hits: await this.prisma.listing.findMany({
                ...args,
                take: dto.limit,
            }),
        }
    }

    metadataToWhereInput(dto: Partial<FindAllListingsDto>): Prisma.ListingFindManyArgs {
        const args: Prisma.ListingFindManyArgs & {
            where: Prisma.ListingWhereInput & {
                OR?: Prisma.ListingWhereInput[]
            }
        } = {
            where: {
                OR: [],
            },
        }

        if (dto.page && dto.page > 0) {
            args.skip = (dto.page - 1) * (dto.limit ?? 20)
        }

        const listingSortToOrderBy: Record<ListingSort, Prisma.ListingOrderByWithRelationInput> = {
            [ListingSort.DATE_ASC]: {
                date: 'asc',
            },
            [ListingSort.DATE_DESC]: {
                date: 'desc',
            },
            [ListingSort.PRICE_ASC]: {
                price: {
                    value: 'asc',
                },
            },
            [ListingSort.PRICE_DESC]: {
                price: {
                    value: 'desc',
                },
            },
            [ListingSort.RELEVANCE]: undefined,
        }

        // TODO: SORT
        if (dto.sort !== ListingSort.RELEVANCE) {
            args.orderBy = {
                ...listingSortToOrderBy[dto.sort],
            }
        }

        if (dto.priceRangeGte) {
            args.where = {
                ...args.where,
                price: {
                    is: {
                        value: {
                            gte: dto.priceRangeGte,
                        },
                    },
                },
            }
        }

        if (dto.priceRangeLte) {
            args.where = {
                ...args.where,
                price: {
                    is: {
                        value: {
                            ...((args.where.price?.is.value as any) ?? {}),
                            lte: dto.priceRangeLte,
                        },
                    },
                },
            }
        }

        for (const key in dto) {
            const value = dto[key]
            if (!value) continue
            switch (key as keyof typeof dto) {
                case 'keyword':
                    args.where.title = {
                        contains: value,
                    }
                    break
                case 'regions':
                    if (Array.isArray(value)) {
                        for (const region of value)
                            args.where.OR.push({
                                region,
                            })
                    } else {
                        args.where.OR.push({
                            region: value,
                        })
                    }
                    break
                case 'category':
                    args.where.category = value
                    break
                case 'auction':
                    args.where.isAuction = value
                    break
                // case key.match(/priceRange(Gte|Lte)/)?.input:
                //     if (key.match(/(Gte)$/)) {
                //         .$and.push({ 'price.value': { $gte: +value } })
                //         args.where
                //     } else if (key.match(/(Lte)$/)) {
                //         filters.$and.push({ 'price.value': { $lte: +value } })
                //     }
                //     break
                case 'dateGte':
                    args.where.date = {
                        gte: new Date(+value),
                    }
                    break
            }
        }

        // Remove unnecessary keys
        if (!args.where.OR.length) args.where = _.omit(args.where, 'OR')

        return args
    }

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
}

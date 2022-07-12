import { Injectable } from '@nestjs/common'
import { Listing, Prisma } from '@mewi/prisma'
import { omit } from 'lodash'
import util from 'util'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { filterPipelineStage } from './helpers/filters'
import { LAST_PL_STAGES } from './constants'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'
import { PrismaService } from '@/prisma/prisma.service'

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

        const hits = await this.prisma.improvedAggregate(this.prisma.listing, {
            pipeline: [
                ...hitsPipeline,
                {
                    $group: { _id: null, array: { $push: '$_id' } },
                },
            ],
        })

        return {
            filters: dto,
            totalHits,
            hits,
        }
    }

    metadataToPL(dto: Partial<FindAllListingsDto>): Prisma.InputJsonValue[] {
        const pipeline: Prisma.InputJsonValue[] = []

        for (const [key, value] of Object.entries(omit(dto, LAST_PL_STAGES))) {
            if (value !== undefined) {
                const stage = filterPipelineStage(key as any, value)

                if (key === 'keyword') {
                    pipeline.unshift(...stage)
                } else {
                    pipeline.push(...stage)
                }
            }
        }

        // Add the stages that needs to be last in pipeline
        const stages = Array.from(LAST_PL_STAGES).reduce((prev, cur, i, arr) => {
            const key = LAST_PL_STAGES[i]
            return [...prev, ...filterPipelineStage(key, dto[key])]
        }, [] as any[])
        pipeline.push(...stages)

        if (!dto.sort && dto.keyword) {
            pipeline.push({ $sort: { score: -1 } })
        }

        process.env.NODE_ENV !== 'production' &&
            console.log(util.inspect(pipeline, { depth: null }))

        return pipeline
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

import { Injectable, NotFoundException } from '@nestjs/common'
import { Listing, Prisma } from '@mewi/prisma'
import { omit } from 'lodash'
import { UpdateListingDto } from './dto/update-listing.dto'
import { filterPipelineStage } from './helpers/filter-pipeline-stage'
import { FIRST_PL_STAGES, LAST_PL_STAGES } from './constants'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'
import { PrismaService } from '@/prisma/prisma.service'
import { CreateListingDto } from './dto/create-listing.dto'

@Injectable()
export class ListingsService {
    constructor(private prisma: PrismaService) {}

    async create(createListingDto: CreateListingDto): Promise<Listing> {
        return await this.prisma.listing.create({
            data: createListingDto,
        })
    }

    async findAll(dto: FindAllListingsDto) {
        const totalHitsPipeline = this.metadataToPL(omit(dto, 'page', 'limit'))
        const hitsPipeline = this.metadataToPL(dto)

        let totalHits = (await this.prisma.listing.aggregateRaw({
            pipeline: [...totalHitsPipeline, { $count: 'totalHits' }],
        })) as unknown as any[]
        totalHits = totalHits[0]?.totalHits ?? 0

        const hits = await this.prisma.improvedAggregate(this.prisma.listing, {
            pipeline: hitsPipeline,
        })

        return {
            filters: dto,
            totalHits,
            hits,
        }
    }

    metadataToPL(dto: Partial<FindAllListingsDto>): Prisma.InputJsonValue[] {
        const pipeline: Prisma.InputJsonValue[] = []
        const ANY_ORDER_STAGES = Object.keys(
            omit(dto, ...LAST_PL_STAGES, ...FIRST_PL_STAGES)
        ) as any[]

        const pushStages = (arr: (keyof FindAllListingsDto)[]) => {
            const stages = Array.from(arr).reduce((prev, cur, i, arr) => {
                const key = arr[i]
                return [...prev, ...filterPipelineStage(key, dto[key], dto)]
            }, [] as any[])
            pipeline.push(...stages)
        }

        pushStages(FIRST_PL_STAGES)
        pushStages(ANY_ORDER_STAGES)
        pushStages(LAST_PL_STAGES)

        if (!dto.sort && dto.keyword) {
            pipeline.push({ $sort: { score: -1 } })
        }

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

        if (!listing) throw new NotFoundException()

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
        if (!listing) throw new NotFoundException()

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

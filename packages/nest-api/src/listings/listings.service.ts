import { Injectable, NotFoundException } from '@nestjs/common'
import { omit } from 'lodash'
import { UpdateListingDto } from './dto/update-listing.dto'
import { filterPipelineStage } from './helpers/filter-pipeline-stage'
import { FIRST_PL_STAGES, LAST_PL_STAGES } from './constants'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'
import { CreateListingDto } from './dto/create-listing.dto'
import { ListingsRepository } from './listings.repository'
import { FilterQuery, PipelineStage } from 'mongoose'
import { Listing } from '@/schemas/listing.schema'
import { UsersRepository } from '@/users/users.repository'

@Injectable()
export class ListingsService {
    constructor(
        private readonly listingsRepository: ListingsRepository,
        private readonly usersRepository: UsersRepository
    ) {}

    async create(createListingDto: CreateListingDto) {
        return this.listingsRepository.create(createListingDto)
    }

    async findAll(dto: FindAllListingsDto) {
        const totalHitsPipeline = this.metadataToPL(omit(dto, 'page', 'limit'))
        const hitsPipeline = this.metadataToPL(dto)

        let totalHits = (await this.listingsRepository.aggregate([
            ...totalHitsPipeline,
            { $count: 'totalHits' },
        ])) as unknown as any[]
        totalHits = totalHits[0]?.totalHits ?? 0

        const hits = await this.listingsRepository.aggregate(hitsPipeline)

        return {
            filters: dto,
            totalHits,
            hits,
        }
    }

    metadataToPL(dto: Partial<FindAllListingsDto>): PipelineStage[] {
        const pipeline: PipelineStage[] = []
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
        return await this.listingsRepository.findById(id)
    }

    async update(id: string, updateListingDto: UpdateListingDto): Promise<Listing | null> {
        const updatedListing = await this.listingsRepository.findByIdAndUpdate(id, updateListingDto)
        return updatedListing
    }

    async remove(id: string) {
        await this.listingsRepository.findByIdAndDelete(id)
    }

    async sample(count = 1) {
        return this.listingsRepository.sample(count)
    }

    async autocomplete(keyword: string) {
        const response = await this.listingsRepository.find(
            {
                title: {
                    $regex: new RegExp(keyword, 'i'),
                },
            },
            {
                limit: 5,
            }
        )

        if (!response) return []

        return response.map((x) => x.title)
    }

    async deleteMany(dto: FilterQuery<Listing>) {
        return await this.listingsRepository.deleteMany(dto)
    }

    async like(userId: string, listingId: string) {
        // Check if user already has liked the listing
        const user = await this.usersRepository.findById(userId)
        const listing = await this.listingsRepository.findById(listingId)

        if (!user) throw new NotFoundException('User not found')
        if (!listing) throw new NotFoundException(`Listing with id ${listingId} not found`)

        if (!user.likedListings.includes(listing)) {
            await this.usersRepository.findByIdAndUpdate(userId, {
                $push: {
                    likedListings: listingId,
                },
            })
        }
    }

    async unlike(userId: string, listingId: string) {
        const user = await this.usersRepository.findById(userId)
        const listing = await this.listingsRepository.findById(listingId)

        if (!user) throw new NotFoundException('User not found')
        if (!listing) throw new NotFoundException(`Listing with id ${listingId} not found`)

        if (!user.likedListings.includes(listing)) {
            await this.usersRepository.findByIdAndUpdate(userId, {
                $pull: {
                    likedListings: listingId,
                },
            })
        }
    }
}

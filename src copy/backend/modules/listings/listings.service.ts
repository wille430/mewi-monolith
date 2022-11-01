import omit from 'lodash/omit'
import type { FilterQuery, PipelineStage } from 'mongoose'
import { NotFoundException } from 'next-api-decorators'
import { autoInjectable, inject } from 'tsyringe'
import { FIRST_PL_STAGES, LAST_PL_STAGES } from './constants'
import type { CreateListingDto } from './dto/create-listing.dto'
import type { FindAllListingsDto } from './dto/find-all-listing.dto'
import type { UpdateListingDto } from './dto/update-listing.dto'
import { filterPipelineStage } from './helpers/filter-pipeline-stage'
import { ListingsRepository } from './listings.repository'
import { UsersRepository } from '../users/users.repository'
import type { Listing } from '../schemas/listing.schema'

@autoInjectable()
export class ListingsService {
    constructor(
        @inject(ListingsRepository) private readonly listingsRepository: ListingsRepository,
        @inject(UsersRepository) private readonly usersRepository: UsersRepository
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

        const hits =
            hitsPipeline.length === 0
                ? await this.listingsRepository.find({})
                : await this.listingsRepository.aggregate(hitsPipeline)

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

        return
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

        return
    }
}

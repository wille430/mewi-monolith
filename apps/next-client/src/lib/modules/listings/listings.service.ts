import omit from 'lodash/omit'
import {NotFoundException} from 'next-api-decorators'
import {autoInjectable, inject} from 'tsyringe'
import type {CreateListingDto} from './dto/create-listing.dto'
import type {FindAllListingsDto} from './dto/find-all-listing.dto'
import type {UpdateListingDto} from './dto/update-listing.dto'
import {ListingsRepository} from './listings.repository'
import {UsersRepository} from '../users/users.repository'
import {Listing} from '@mewi/entities'
import {DeleteListingsDto} from './dto/delete-listings.dto'
import {FindAllListingsReponse} from './dto/find-all-listings-response.dto'
import {FilteringService} from "@mewi/business"
import {ObjectId} from "mongodb"

@autoInjectable()
export class ListingsService {
    constructor(
        @inject(ListingsRepository) private readonly listingsRepository: ListingsRepository,
        @inject(UsersRepository) private readonly usersRepository: UsersRepository,
        @inject(FilteringService) private readonly filteringService: FilteringService
    ) {
    }

    async create(createListingDto: CreateListingDto) {
        return this.listingsRepository.create(createListingDto)
    }

    async findAll(dto: FindAllListingsDto): Promise<FindAllListingsReponse> {
        const totalHitsPipeline = this.filteringService.convertToPipeline(omit(dto, 'page', 'limit'))
        const hitsPipeline = this.filteringService.convertToPipeline(dto)

        let totalHits: any = (await this.listingsRepository.aggregate([
            ...totalHitsPipeline,
            {$count: 'totalHits'},
        ])) as unknown as [{ totalHits: number }]
        totalHits = totalHits[0]?.totalHits ?? 0

        let hits = await this.listingsRepository.aggregate(hitsPipeline)
        hits ??= []

        // aggregation will not cast _id to id apparently
        const hitDtos = hits?.map((o) => Listing.convertToDto(o))

        return {
            filters: dto,
            totalHits,
            hits: hitDtos,
        }
    }

    async findOne(id: string) {
        return await this.listingsRepository.findById(id)
    }

    async update(id: string, updateListingDto: UpdateListingDto): Promise<Listing | null> {
        return await this.listingsRepository.findByIdAndUpdate(id, updateListingDto)
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
                where: {
                    title: {
                        $regex: new RegExp(keyword, 'i'),
                    },
                },
                limit: 5
            },
        )

        if (!response) return []

        return response.map((x) => x.title)
    }

    deleteMany(dto: DeleteListingsDto) {
        return this.listingsRepository.deleteMany({
            ...dto,
            origin: dto.origins
                ? {
                    $in: dto.origins,
                }
                : undefined,
        })
    }

    async like(userId: string, listingId: string) {
        // Check if user already has liked the listing
        const user = await this.usersRepository.findById(userId)
        const listing = await this.listingsRepository.findById(listingId)

        if (!user) throw new NotFoundException('User not found')
        if (!listing) throw new NotFoundException(`Listing with id ${listingId} not found`)

        if (!(user.likedListings as ObjectId[]).includes(listing.id)) {
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

        if (!(user.likedListings as ObjectId[]).includes(listing.id)) {
            await this.usersRepository.findByIdAndUpdate(userId, {
                $pull: {
                    likedListings: listingId,
                },
            })
        }

        return
    }

    public async getFeatured() {
        return this.listingsRepository.sample(8, {
            imageUrl: {
                $exists: true,
                $not: {
                    $size: 0
                }
            }
        })
    }

    async getRecent() {
        const listings = await this.listingsRepository.find({}, {
            sort: {
                date: -1
            },
            limit: 8
        })
        return listings ?? []
    }
}

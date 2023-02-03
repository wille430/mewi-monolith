import omit from 'lodash/omit'
import type {PipelineStage} from 'mongoose'
import {NotFoundException} from 'next-api-decorators'
import {autoInjectable, inject} from 'tsyringe'
import {MIN_SEARCH_SCORE} from './constants'
import type {CreateListingDto} from './dto/create-listing.dto'
import type {FindAllListingsDto} from './dto/find-all-listing.dto'
import type {UpdateListingDto} from './dto/update-listing.dto'
import {ListingsRepository} from './listings.repository'
import {UsersRepository} from '../users/users.repository'
import {Listing} from '../schemas/listing.schema'
import {DeleteListingsDto} from './dto/delete-listings.dto'
import {FindAllListingsReponse} from './dto/find-all-listings-response.dto'
import {ListingSort} from "@/common/types"
import {FilteringService} from "@/lib/modules/filtering/filtering.service"

@autoInjectable()
export class ListingsService {

    private static readonly sortToSortObjMap: Record<ListingSort, any> = {
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
        const totalHitsPipeline = this.metadataToPL(omit(dto, 'page', 'limit'))
        const hitsPipeline = this.metadataToPL(dto)

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

    public metadataToPL(dto: Partial<FindAllListingsDto>): PipelineStage[] {
        const pipeline: PipelineStage[] = []

        this.applyFieldsFilter(dto, pipeline)

        if (dto.sort) {
            this.filteringService.applySort({
                sort: ListingsService.sortToSortObjMap[dto.sort]
            }, pipeline)
        } else if (!dto.keyword) {
            this.filteringService.applySort({
                sort: ListingsService.sortToSortObjMap[ListingSort.DATE_DESC]
            }, pipeline)
        }

        if (!dto.sort && dto.keyword) {
            pipeline.push({$sort: {score: -1}})
        }

        this.filteringService.applyPagination(dto, pipeline)
        return pipeline
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

    private applyFieldsFilter(dto: Partial<FindAllListingsDto>, pipeline: PipelineStage[]) {
        for (const kv of Object.entries(dto)) {
            this.applyFieldFilter(kv[0], kv[1], pipeline)
        }
    }

    private applyFieldFilter(field: string, value: any, pipeline: PipelineStage[]) {
        if (!value) return

        switch (field) {
            case 'keyword':
                pipeline.push(
                    process.env.DATABASE_URI.includes('localhost') &&
                    process.env.NODE_ENV === 'development'
                        ? {
                            $match: {
                                keyword: {
                                    $regex: new RegExp(value, 'i'),
                                },
                            },
                        }
                        : {
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
                            score: {$meta: 'searchScore'},
                        },
                    },
                    {$match: {score: {$gte: MIN_SEARCH_SCORE}}},
                )
                break
            case 'auction':
                pipeline.push({$match: {auction: value}})
                break
            case 'categories':
                pipeline.push({$match: {category: {$in: value}}})
                break
            case 'dateGte':
                pipeline.push(
                    {
                        $match: {
                            date: {
                                $gte: {
                                    $date: value,
                                },
                            },
                        },
                    },
                )
                break
            case 'priceRangeGte':
                pipeline.push({$match: {'price.value': {$gte: value}}})
                break
            case 'priceRangeLte':
                pipeline.push({$match: {'price.value': {$lte: value}}})
                break
            case 'region':
                const regions = value
                    .split(/(\.|,| )? /i)
                    .filter((x: string) => !!x && !new RegExp(/^,$/).test(x))
                    .map((x: string) => x.trim())

                pipeline.push(
                    {
                        $match: {
                            region: {
                                $regex: (`^` +
                                    regions.map((reg: any) => '(?=.*\\b' + reg + '\\b)').join('') +
                                    '.+') as any,
                                $options: 'i',
                            },
                        },
                    },
                )
                break
            case 'origins':
                pipeline.push({$match: {origin: {$in: value}}})
                break
            default:
                break
        }
    }
}

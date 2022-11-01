import 'reflect-metadata'
import { container } from 'tsyringe'
import { userStub } from '@mewi/test-utils'
import { listingStub } from './stubs/listing.stub'
import type { DeleteListingsDto } from '../dto/delete-listings.dto'
import type { FindAllListingsDto } from '../dto/find-all-listing.dto'
import type { UpdateListingDto } from '../dto/update-listing.dto'
import { ListingsRepository } from '../listings.repository'
import { ListingsService } from '../listings.service'
import { UsersRepository } from '../../users/users.repository'
import { Listing } from '../../schemas/listing.schema'

jest.mock('../listings.repository')
jest.mock('../../users/users.repository')

describe('ListingsService', () => {
    let listingsService: ListingsService
    let listingsRepository: ListingsRepository
    let usersRepository: UsersRepository

    beforeEach(async () => {
        listingsService = container.resolve(ListingsService)
        listingsRepository = container.resolve(ListingsRepository)
        usersRepository = container.resolve(UsersRepository)

        jest.clearAllMocks()
    })

    describe('#findAll', () => {
        describe('when findAll is called', () => {
            let result: any
            let findAllListingsDto: FindAllListingsDto

            beforeEach(async () => {
                findAllListingsDto = {
                    limit: 99999,
                }

                jest.spyOn(listingsRepository, 'aggregate').mockResolvedValueOnce([
                    {
                        totalHits: 1,
                    },
                ])

                result = await listingsService.findAll(findAllListingsDto)
            })

            it('then it should call the listingsRepository', () => {
                expect(listingsRepository.aggregate).toHaveBeenNthCalledWith(
                    1,
                    expect.arrayContaining([
                        {
                            $count: 'totalHits',
                        },
                    ])
                )

                expect(listingsRepository.aggregate).toHaveBeenNthCalledWith(
                    2,
                    expect.arrayContaining([
                        {
                            $limit: findAllListingsDto.limit,
                        },
                    ])
                )
            })

            it('then it should return listings', () => {
                expect(result.filters).toEqual(findAllListingsDto)
                expect(result.hits).toMatchObject([listingStub()])
                expect(result.totalHits).toBe(1)
            })
        })
    })

    describe('#findOne', () => {
        describe('when findOne is called', () => {
            let listing: Listing | null

            beforeEach(async () => {
                listing = await listingsService.findOne(listingStub().id)
            })

            it('then it should call the listingsRepository', () => {
                expect(listingsRepository.findById).toHaveBeenCalledWith(listingStub().id)
            })

            it('then it should return listing', () => {
                expect(listing).toEqual(listingStub())
            })
        })
    })

    describe('#update', () => {
        describe('when update is called', () => {
            let listing: Listing | null
            let updateListingDto: UpdateListingDto

            beforeEach(async () => {
                updateListingDto = {
                    ...listingStub(),
                }
                listing = await listingsService.update(listingStub().id, updateListingDto)
            })

            it('then it should call the listingsRepository', () => {
                expect(listingsRepository.findByIdAndUpdate).toHaveBeenCalledWith(
                    listingStub().id,
                    updateListingDto
                )
            })

            it('then it should return listing', () => {
                expect(listing).toEqual(listingStub())
            })
        })
    })

    describe('#remove', () => {
        describe('when remove is called', () => {
            let res: any

            beforeEach(async () => {
                res = await listingsService.remove(listingStub().id)
            })

            it('then it should call the listingsRepository', () => {
                expect(listingsRepository.findByIdAndDelete).toHaveBeenCalledWith(listingStub().id)
            })

            it('then it should return undefined', () => {
                expect(res).toBe(undefined)
            })
        })
    })

    describe('#sample', () => {
        describe('when sample is called', () => {
            let listings: Listing[] | null
            let count: number

            beforeEach(async () => {
                count = 5
                listings = await listingsService.sample(count)
            })

            it('then it should call the listingsRepository', () => {
                expect(listingsRepository.sample).toHaveBeenCalledWith(count)
            })

            it('then it should return listings', () => {
                expect(listings).toEqual([listingStub()])
            })
        })
    })

    describe('#autocomplete', () => {
        describe('when autocomplete is called', () => {
            let phrases: string[]
            let keyword: string

            beforeEach(async () => {
                keyword = listingStub().title
                phrases = await listingsService.autocomplete(keyword)
            })

            it('then it should call the listingsRepository', () => {
                expect(listingsRepository.find).toHaveBeenCalledWith(
                    {
                        title: {
                            $regex: new RegExp(keyword, 'i'),
                        },
                    },
                    {
                        limit: 5,
                    }
                )
            })

            it('then it should return phrases', () => {
                expect(phrases).toEqual([listingStub().title])
            })
        })
    })

    describe('#deleteMany', () => {
        describe('when deleteMany is called', () => {
            let res: any
            let dto: DeleteListingsDto

            beforeEach(async () => {
                dto = {
                    auction: listingStub().isAuction,
                    limit: 20,
                }
                res = await listingsService.deleteMany(dto)
            })

            it('then it should call the listingsRepository', () => {
                expect(listingsRepository.deleteMany).toHaveBeenCalledWith(dto)
            })

            it('then it should return undefined', () => {
                expect(res).toBe(1)
            })
        })
    })

    describe('#like', () => {
        describe('when like is called', () => {
            let res: any

            beforeEach(async () => {
                res = await listingsService.like(userStub().id, listingStub().id)
            })

            it('then it should call the listingsRepository', () => {
                expect(usersRepository.findByIdAndUpdate).toHaveBeenCalledWith(userStub().id, {
                    $push: {
                        likedListings: listingStub().id,
                    },
                })
            })

            it('then it should return undefined', () => {
                expect(res).toBe(undefined)
            })
        })
    })

    describe('#unlike', () => {
        describe('when unlike is called', () => {
            let res: any

            beforeEach(async () => {
                res = await listingsService.unlike(userStub().id, listingStub().id)
            })

            it('then it should call the listingsRepository', () => {
                expect(usersRepository.findByIdAndUpdate).toHaveBeenCalledWith(userStub().id, {
                    $pull: {
                        likedListings: listingStub().id,
                    },
                })
            })

            it('then it should return undefined', () => {
                expect(res).toBe(undefined)
            })
        })
    })
})

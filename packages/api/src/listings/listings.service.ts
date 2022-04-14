import { Injectable } from '@nestjs/common'
import { Listing, ListingDocument } from '@/listings/listing.schema'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model, FilterQuery, QueryOptions } from 'mongoose'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'
import { Sort, sortableFields } from '@wille430/common'
import _ from 'lodash'

@Injectable()
export class ListingsService {
    constructor(@InjectModel(Listing.name) private listingModel: Model<ListingDocument>) {}

    async create(createListingDto: CreateListingDto): Promise<Listing> {
        const createdListing = new this.listingModel(createListingDto)
        return createdListing.save()
    }

    async findAll(dto: FindAllListingsDto) {
        const { filters, options } = this.createMongoFilters(dto)

        return {
            filters: dto,
            totalHits: await this.listingModel.count(filters),
            hits: await this.listingModel.find(filters, {}, options),
        }
    }

    createMongoFilters(dto: Partial<FindAllListingsDto>): {
        filters: FilterQuery<ListingDocument>
        options: QueryOptions
    } {
        let filters: FilterQuery<ListingDocument> = { $and: [] }
        const options: QueryOptions = { limit: +dto.limit }

        if (dto.page && +dto.page > 0) {
            options.skip = (+dto.page - 1) * +dto.limit
        }

        if (dto.sort && dto.sort !== Sort.RELEVANCE) {
            options.sort = sortableFields[dto.sort]
        }

        if (dto.priceRangeGte) {
            filters.$and.push({ 'price.value': { $gte: dto.priceRangeGte } })
        }

        if (dto.priceRangeLte) {
            filters.$and.push({ 'price.value': { $lte: dto.priceRangeLte } })
        }

        for (const key in dto) {
            const value = dto[key]
            switch (key as keyof typeof dto) {
                case 'keyword':
                    filters.$text = {
                        ...(filters.$text || []),
                        $search: value,
                    }
                    break
                case 'regions':
                    if (Array.isArray(value)) {
                        filters.$and.push({ region: (value as string[]).join(', ') })
                    } else {
                        filters.$and.push({ region: [value as string].join(', ') })
                    }
                    break
                case 'category':
                    filters.$and.push({
                        [key]: { $all: value },
                    })
                    break
                case 'auction':
                    filters.$and.push({
                        isAuction: value,
                    })
                    break
                case key.match(/priceRange(Gte|Lte)/)?.input:
                    if (key.match(/(Gte)$/)) {
                        filters.$and.push({ 'price.value': { $gte: +value } })
                    } else if (key.match(/(Lte)$/)) {
                        filters.$and.push({ 'price.value': { $lte: +value } })
                    }
                    break
                case 'dateGte':
                    filters.$and.push({ date: { $gte: +value } })
                    break
            }
        }

        if (!filters.$and.length) {
            filters = _.omit(filters, '$and')
        }

        return { filters, options }
    }

    async findOne(id: number) {
        return await this.listingModel.findById(id)
    }

    async update(id: number, updateListingDto: UpdateListingDto): Promise<Listing> {
        await this.listingModel.updateOne({ _id: id }, updateListingDto)
        const updatedListing = this.listingModel.findById(id)
        return updatedListing
    }

    async remove(id: number) {
        await this.listingModel.deleteOne({ _id: id })
    }

    async sample(count = 1) {
        const totalDocs = await this.listingModel.count()

        const randomNums = Array.from({ length: count }, () =>
            Math.floor(Math.random() * totalDocs)
        )

        const randomDocs = []
        const addedDocNums = []

        for (const i of randomNums) {
            if (!addedDocNums.includes(i)) {
                randomDocs.push(await this.listingModel.findOne().skip(i))
                addedDocNums.push(i)
            }
        }

        return randomDocs
    }

    async autocomplete(keyword: string) {
        const response = await this.listingModel.aggregate([
            { $match: { $text: { $search: keyword } } },
            { $limit: 5 },
            { $project: { _id: 0, title: 1 } },
        ])

        return response.map((x) => x.title)
    }
}

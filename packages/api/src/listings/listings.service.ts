import { Injectable } from '@nestjs/common'
import { Listing, ListingDocument } from '@/listings/listing.schema'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model, FilterQuery } from 'mongoose'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'

@Injectable()
export class ListingsService {
    constructor(@InjectModel(Listing.name) private listingModel: Model<ListingDocument>) {}

    async create(createListingDto: CreateListingDto): Promise<Listing> {
        const createdListing = new this.listingModel(createListingDto)
        return createdListing.save()
    }

    async findAll(dto: FindAllListingsDto) {
        let filter: FilterQuery<ListingDocument> = { $and: [] }

        if (dto.priceRangeGte) {
            filter.$and.push({ 'price.value': { $gte: dto.priceRangeGte } })
        }

        if (dto.priceRangeLte) {
            filter.$and.push({ 'price.value': { $lte: dto.priceRangeLte } })
        }

        for (const key in dto) {
            const value = dto[key]
            switch (key as keyof typeof dto) {
                case 'keyword':
                    filter.$text = {
                        ...(filter.$text || []),
                        $search: value,
                    }
                    break
                case 'regions':
                    if (Array.isArray(value)) {
                        filter.$and.push({ region: (value as string[]).join(', ') })
                    } else {
                        filter.$and.push({ region: [value as string].join(', ') })
                    }
                    break
                case 'category':
                    filter.$and.push({
                        [key]: { $all: value },
                    })
                    break
                case 'auction':
                    filter.$and.push({
                        isAuction: value,
                    })
                    break
                case key.match(/priceRange(Gte|Lte)/)?.input:
                    if (key.match(/(Gte)$/)) {
                        filter.$and.push({ 'price.value': { $gte: value } })
                    } else if (key.match(/(Lte)$/)) {
                        filter.$and.push({ 'price.value': { $lte: value } })
                    }
                    break
                case 'dateGte':
                    filter.$and.push({ date: { $gte: key } })
                    break
            }
        }

        if (!filter.$and.length) {
            filter = {}
        }

        return {
            filters: dto,
            totalHits: await this.listingModel.count(filter),
            hits: await this.listingModel.find(filter, {}, { limit: dto.limit }),
        }
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
}

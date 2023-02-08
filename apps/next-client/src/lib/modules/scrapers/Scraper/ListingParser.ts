import { Category, ListingOrigin } from '@/common/schemas'
import { stringSimilarity } from '@/lib/utils/stringUtils'
import { createHash } from 'crypto'
import { Listing } from '../../schemas/listing.schema'
import { AbstractEndPoint } from './EndPoint'

export class ListingParser {
    private origin: ListingOrigin
    private endPoint: AbstractEndPoint<Listing>

    constructor(origin: ListingOrigin, endPoint: AbstractEndPoint<Listing>) {
        this.origin = origin
        this.endPoint = endPoint
    }

    public async parseListing(obj: Partial<Listing>): Promise<Partial<Listing>> {
        return {
            ...obj,
            origin: this.origin,
            entryPoint: this.endPoint.getIdentifier(),
        }
    }

    stringToCategoryMap: Record<string, Category> = {}
    public parseCategory(_string: string): Promise<Category> | Category {
        const string = _string.toUpperCase()
        if (this.stringToCategoryMap[string]) return this.stringToCategoryMap[string]

        if (string in Category && Category[string as Category] != null)
            return string.toUpperCase() as Category

        for (const category of Object.values(Category)) {
            const similarity = stringSimilarity(category, string) * 2
            if (similarity >= 0.7) {
                this.stringToCategoryMap[string] = category as Category
                return category as Category
            }
        }

        this.stringToCategoryMap[string] = Category.OVRIGT
        return Category.OVRIGT
    }

    /**
     * Create an ID from a string
     *
     * @param string - A unique string
     * @returns An unique ID
     */
    public createId(string: string) {
        const shasum = createHash('sha1')
        shasum.update(string)

        return `${this.origin}-${shasum.digest('hex')}`
    }
}

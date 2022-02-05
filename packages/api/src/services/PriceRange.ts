class PriceRange {
    lte = null
    gte = null

    constructor(lte = null, gte = null) {
        this.lte = lte
        this.gte = gte
    }

    /**
     * @param toObject Turn PriceRange to object that ElasticSearch can understand
     */
    toObject() {
        const returnObj: any = {}
        if (this.gte) returnObj.gte = this.gte
        if (this.lte) returnObj.lte = this.lte
        return returnObj
    }

    /**
     * @param toString Turn PriceRange to readable string
     */
    toString() {
        const returnString = ''

        this.lte && returnString.concat(this.lte)
        returnString.concat('-')
        this.gte && returnString.concat(this.gte)

        return returnString
    }
}

export default PriceRange

import {Listing} from "@mewi/entities"
import axios, {AxiosRequestConfig, AxiosResponse} from "axios"
import {ListingParser} from "../ListingParser"
import {Currency, ListingOrigin} from "@mewi/models"
import {ScrapeMetadata} from "../Scraper"
import {BlocketListing} from "./BlocketListing.interface"
import {AbstractEndPoint} from "../EndPoint"
import {NextDataFetcher} from "../NextDataFetcher"

export class BlocketEndPoint extends AbstractEndPoint<Listing, AxiosResponse, BlocketListing> {
    private parser: ListingParser
    private nextDataFetcher: NextDataFetcher

    constructor() {
        super(BlocketEndPoint.name)
        this.parser = new ListingParser(ListingOrigin.Blocket, this)
        this.nextDataFetcher = new NextDataFetcher('https://www.blocket.se/')
    }

    protected async getResponse(page: number): Promise<any> {
        return axios(await this.createAxiosConfig(page))
    }

    protected extractEntities(res: AxiosResponse): any[] | Promise<any[]> {
        return res.data.data
    }

    protected async getScrapeMetadata(res: AxiosResponse): Promise<ScrapeMetadata> {
        return {
            totalPages: res.data.total_page_count,
        }
    }

    protected async parseRawEntity(obj: BlocketListing): Promise<Partial<Listing>> {
        return this.parser.parseListing({
            origin_id: this.parser.createId(obj.ad_id),
            title: obj.subject,
            body: obj.body,
            category: await this.parser.parseCategory(obj.category[0].name),
            date: new Date(obj.list_time),
            imageUrl: obj.images
                ? obj.images.map(
                    (img: { url: string }) => img.url + '?type=mob_iphone_vi_normal_retina'
                )
                : [],
            redirectUrl: obj.share_url,
            isAuction: false,
            price: obj.price
                ? {
                    value: parseFloat(obj.price.value),
                    currency: Currency.SEK,
                }
                : undefined,
            region: this.parseRegion(obj.location),
            parameters: this.parseParameters(obj.parameter_groups),
        })
    }

    private async createAxiosConfig(page: number): Promise<AxiosRequestConfig> {
        const limit = 40
        const nextData = await this.nextDataFetcher.getJson()
        const bearer = nextData.props.initialReduxState.authentication.bearerToken

        return {
            url: `https://api.blocket.se/search_bff/v2/content?lim=${limit}&page=${page}&st=s&status=active&include=placements&gl=3&include=extend_with_shipping`,
            headers: {
                Authorization: `Bearer ${bearer}`,
            }
        }
    }

    private parseRegion(location: BlocketListing['location']) {
        const regionLocation = location.find((x) => x.query_key === 'r')

        if (!regionLocation) {
            return location[0].name
        } else {
            return regionLocation.name
        }
    }

    private parseParameters(parameterGroups: BlocketListing['parameter_groups']) {
        const parameters: Listing['parameters'] = []

        if (parameterGroups) {
            for (const parameterGroup of parameterGroups) {
                if (parameterGroup) {
                    for (const parameter of parameterGroup.parameters) {
                        parameters.push({
                            label: parameter.label,
                            value: parameter.value,
                        })
                    }
                }
            }
        }

        return parameters
    }
}

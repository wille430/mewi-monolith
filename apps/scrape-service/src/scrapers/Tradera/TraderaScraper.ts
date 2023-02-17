import {Scraper} from '../Scraper'
import {TraderaCategories} from './TraderaCategories'
import {TraderaEndPoint} from './TraderaEndPoint'
import {Listing} from "@mewi/entities"
import {ListingOrigin} from "@mewi/models"

export class TraderaScraper extends Scraper<Listing> {

    public static createEndpoints = () =>
        TraderaCategories.map(({href}) => href).map(
            (href) => new TraderaEndPoint(href)
        )

    constructor() {
        super(ListingOrigin.Tradera, 'https://www.tradera.com/', TraderaScraper.createEndpoints())
    }
}

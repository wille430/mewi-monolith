import {IWebScraperConfig, WebScraperContext} from "./WebScraperContext";
import {HttpFetchStrategyConfig} from "../fetchers/AbstractAxiosFetchStrategy";
import {HtmlFetchStrategyConfig} from "../fetchers/HtmlFetchStrategy";

export class BytbilContext extends WebScraperContext<BytbilConfig> {
    constructor() {
        const categories = BytbilConfig.vehicleTypes;
        const configs = categories.map((cat) => new BytbilConfig(cat));
        super(configs);
    }
}


export class BytbilConfig implements IWebScraperConfig<Partial<HttpFetchStrategyConfig> & HtmlFetchStrategyConfig> {
    public static readonly vehicleTypes = [
        "bil",
        "transportbil",
        "mc",
        "moped",
        "snoskoter",
        "fyrhjuling",
        "husbil",
        "husvagn",
        "slap",
    ];

    public static readonly baseUrl = "https://bytbil.com/";

    public static readonly fetchConfig: Partial<HttpFetchStrategyConfig> &
        HtmlFetchStrategyConfig = {
        selector: ".result-list > .result-list-item",
    };

    private readonly category: string;

    constructor(category: typeof BytbilConfig["vehicleTypes"][number]) {
        this.category = category;
    }

    getUrl(): string {
        return `${BytbilConfig.baseUrl}${this.category}`;
    }

    getFetchConfig(): Partial<HttpFetchStrategyConfig> & HtmlFetchStrategyConfig {
        return BytbilConfig.fetchConfig;
    }

    getIdentifier(): string {
        return this.category;
    }
}

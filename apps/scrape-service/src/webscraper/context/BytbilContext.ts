import {WebScraperConfig, WebScraperContext} from "./WebScraperContext"
import {StopAtExistingOriginIdStrategy} from "../stoppages/StopAtExistingOriginIdStrategy";

export class BytbilContext extends WebScraperContext<BytbilConfig> {
    constructor() {
        const categories = BytbilConfig.vehicleTypes;
        const configs = categories.map((cat) => new BytbilConfig(cat));
        super(configs, new StopAtExistingOriginIdStrategy());
    }
}


export class BytbilConfig extends WebScraperConfig {
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

    private readonly category: string;

    constructor(category: typeof BytbilConfig["vehicleTypes"][number]) {
      super();
      this.category = category;
    }

    getUrl(): string {
        return `${BytbilConfig.baseUrl}${this.category}`;
    }

    getIdentifier(): string {
        return this.category;
    }
}

import { IWebScraperConfig, WebScraperContext } from "./WebScraperContext";
import { HttpFetchStrategyConfig } from "../fetchers/AbstractAxiosFetchStrategy";
import { JsonFetchStrategyConfig } from "../fetchers/JsonFetchStrategy";
import { StopAtOldListingStrategy } from "../stoppages/StopAtOldListingStrategy";
import { ListingOrigin } from "@mewi/models";

export class TraderaContext extends WebScraperContext<TraderaConfig> {
  constructor() {
    const categories = TraderaConfig.categories.map((o) => o.href);
    const configs = categories.map((cat) => new TraderaConfig(cat));
    super(configs, new StopAtOldListingStrategy(ListingOrigin.Tradera));
  }
}

export class TraderaConfig
  implements
    IWebScraperConfig<
      Partial<HttpFetchStrategyConfig> & JsonFetchStrategyConfig
    >
{
  public static categories = [
    { href: "/category/1612", title: "Accessoarer" },
    { href: "/category/20", title: "Antikt & Design" },
    { href: "/category/1611", title: "Barnartiklar" },
    { href: "/category/33", title: "Barnkläder & Barnskor" },
    { href: "/category/302571", title: "Barnleksaker" },
    { href: "/category/34", title: "Biljetter & Resor" },
    { href: "/category/32", title: "Bygg & Verktyg" },
    { href: "/category/11", title: "Böcker & Tidningar" },
    { href: "/category/12", title: "Datorer & Tillbehör" },
    { href: "/category/13", title: "DVD & Videofilmer" },
    { href: "/category/10", title: "Fordon, Båtar & Delar" },
    { href: "/category/14", title: "Foto, Kameror & Optik" },
    { href: "/category/15", title: "Frimärken" },
    { href: "/category/36", title: "Handgjort & Konsthantverk" },
    { href: "/category/31", title: "Hem & Hushåll" },
    { href: "/category/17", title: "Hemelektronik" },
    { href: "/category/18", title: "Hobby" },
    { href: "/category/19", title: "Klockor" },
    { href: "/category/16", title: "Kläder" },
    { href: "/category/23", title: "Konst" },
    { href: "/category/21", title: "Musik" },
    { href: "/category/22", title: "Mynt & Sedlar" },
    { href: "/category/29", title: "Samlarsaker" },
    { href: "/category/1623", title: "Skor" },
    { href: "/category/340736", title: "Skönhetsvård" },
    { href: "/category/24", title: "Smycken & Ädelstenar" },
    { href: "/category/25", title: "Sport & Fritid" },
    { href: "/category/26", title: "Telefoni, Tablets & Wearables" },
    { href: "/category/1605", title: "Trädgård & Växter" },
    { href: "/category/30", title: "TV-spel & Datorspel" },
    { href: "/category/27", title: "Vykort & Bilder" },
  ];

  public static readonly baseUrl = "https://www.tradera.com/";

  private readonly category: string;

  constructor(category: string) {
    if (category.at(0) !== "/")
      throw new Error("Tradera categories must start with character '/'");

    if (TraderaConfig.categories.find((o) => o.href === category) == null)
      throw new Error(
        `Could not find ${category} in category map. ${category} is not a valid category`
      );

    this.category = category;
  }

  getFetchConfig(): Partial<HttpFetchStrategyConfig> & JsonFetchStrategyConfig {
    return {
      dataJsonPath: "items",
    };
  }

  getIdentifier(): string {
    return this.category;
  }

  getUrl(): string {
    return `https://www.tradera.com${this.getIdentifier()}.json?paging=MjpBdWN0aW9ufDM5fDE4Nzg0OlNob3BJdGVtfDl8NDMzNTg.&sortBy=AddedOn`;
  }
}

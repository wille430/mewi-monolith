import { ListingOrigin } from "@mewi/models";
import { WebScraperManager } from "../WebScraper";
import { AbstractListingScraperFactory } from "./AbstractListingScraperFactory";
import { BlocketScraperFactory } from "./BlocketScraperFactory";
import { BytbilScraperFactory } from "./BytbilScraperFactory";
import { BlippScraperFactory } from "./BlippScraperFactory";
import { KvdBilScraperFactory } from "./KvdBilScraperFactory";
import { TraderaScraperFactory } from "./TraderaScraperFactory";
import { SellpyScraperFactory } from "./SellpyScraperFactory";
import { BilwebScraperFactory } from "./BilwebScraperFactory";
import { CitiboardScraperFactory } from "./CitiboardScraperFactory";
import { ShpockScraperFactory } from "./ShpockScraperFactory";

export class WebScraperFactory {
  private readonly factoryMap: Record<string, AbstractListingScraperFactory> =
    {};

  private getFactory(cls: { new (): AbstractListingScraperFactory }) {
    if (this.factoryMap[cls.name] == null) {
      this.factoryMap[cls.name] = new cls();
    }

    return this.factoryMap[cls.name];
  }

  public createScraper(origin: ListingOrigin): WebScraperManager<any> {
    let factory: { new (): AbstractListingScraperFactory };
    switch (origin) {
      case ListingOrigin.Blocket:
        factory = BlocketScraperFactory;
        break;
      case ListingOrigin.Tradera:
        factory = TraderaScraperFactory;
        break;
      case ListingOrigin.Sellpy:
        factory = SellpyScraperFactory;
        break;
      case ListingOrigin.Bytbil:
        factory = BytbilScraperFactory;
        break;
      case ListingOrigin.Kvdbil:
        factory = KvdBilScraperFactory;
        break;
      case ListingOrigin.Bilweb:
        factory = BilwebScraperFactory;
        break;
      case ListingOrigin.Blipp:
        factory = BlippScraperFactory;
        break;
      case ListingOrigin.Citiboard:
        factory = CitiboardScraperFactory;
        break;
      case ListingOrigin.Shpock:
        factory = ShpockScraperFactory;
        break;
      default:
        throw new Error(`No factory has been implemented for ${origin}`);
    }

    return this.getFactory(factory).createListingScraperManager();
  }
}

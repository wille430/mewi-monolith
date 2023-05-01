import { ListingOrigin } from "@mewi/models";
import { merge } from "lodash";
import { Listing } from "@mewi/entities";

export interface IParseStrategy<T, R> {
  parse(obj: T): Promise<R> | R;

  parseAll(objs: T[]): Promise<R[]> | R[];
}

export class ListingParseStrategyWrapper<T>
  implements IParseStrategy<T, Listing>
{
  private parseStrategy: IParseStrategy<T, Listing>;
  private readonly origin: ListingOrigin;

  constructor(
    parseStrategy: IParseStrategy<T, Listing>,
    origin: ListingOrigin
  ) {
    this.parseStrategy = parseStrategy;
    this.origin = origin;
  }

  async parse(obj: T): Promise<Listing> {
    const defaultProps: Partial<Listing> = {
      origin: this.origin,
      date: new Date(),
      isAuction: false,
      imageUrl: [],
    };

    return merge({}, defaultProps, await this.parseStrategy.parse(obj));
  }

  parseAll(objs: T[]): Promise<Listing[]> | Listing[] {
    return Promise.all(objs.map((o) => this.parse(o)));
  }
}

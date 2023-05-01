import { Currency, ListingOrigin } from "@mewi/models";
import { IConversionStrategy } from "../conversions/ConversionStrategy";
import { Listing } from "@mewi/entities";
import { AbstractListingParseStrategy } from "./AbstractListingParseStrategy";
import { WebScraper } from "../WebScraper";

export class BlocketParseStrategy extends AbstractListingParseStrategy<
  Record<any, any>
> {
  constructor(webScraper: WebScraper<Listing>) {
    super(ListingOrigin.Blocket, webScraper, {
      region: new (class implements IConversionStrategy {
        convert(obj: any): string {
          const regionLocation = obj.find((x) => x.query_key === "r");

          if (!regionLocation) {
            return obj[0].name;
          } else {
            return regionLocation.name;
          }
        }
      })(),
      parameters: new (class implements IConversionStrategy {
        convert(parameterGroups: any): any {
          const parameters: Listing["parameters"] = [];

          if (parameterGroups) {
            for (const parameterGroup of parameterGroups) {
              if (parameterGroup) {
                for (const parameter of parameterGroup.parameters) {
                  parameters.push({
                    label: parameter.label,
                    value: parameter.value,
                  });
                }
              }
            }
          }
          return parameters;
        }
      })(),
    });
  }

  async parse(obj: Record<any, any>): Promise<Listing> {
    return {
      origin_id: this.conversions.origin_id.convert(obj.ad_id),
      title: obj.subject,
      body: obj.body,
      category: await this.conversions.category.convert(obj.category[0].name),
      date: new Date(obj.list_time),
      imageUrl: obj.images
        ? obj.images.map(
            (img: { url: string }) =>
              img.url + "?type=mob_iphone_vi_normal_retina"
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
      region: this.conversions.region.convert(obj.location),
      parameters: this.conversions.parameters.convert(obj.parameter_groups),
    } as Listing;
  }
}

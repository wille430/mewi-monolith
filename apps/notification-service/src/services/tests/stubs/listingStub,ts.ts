import { Listing } from "@mewi/entities";
import { mongoose } from "@typegoose/typegoose";
import { Category, Currency, ListingDto, ListingOrigin } from "@mewi/models";

const id = "63f8b1e71a7bf14780f5c238";
const date = new Date();
export const listingStub = (): Listing => ({
  _id: new mongoose.Types.ObjectId(id) as any,
  id,
  category: Category.FORDON,
  date: date,
  imageUrl: [],
  isAuction: false,
  origin: ListingOrigin.Blocket,
  origin_id: "blocket-dsada90r3",
  redirectUrl: "https://www.blocket.se",
  title: "Bil",
  price: {
    value: 100000,
    currency: Currency.SEK,
  },
  entryPoint: "/",
  createdAt: new Date(),
  updatedAt: new Date(),
  convertToDto(): ListingDto {
    return null;
  },
});

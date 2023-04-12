import { Listing } from "@mewi/entities";
import mongoose from "mongoose";
import { Category, Currency, ListingOrigin } from "@mewi/models";
import { faker } from "@faker-js/faker";

const id = faker.database.mongodbObjectId();
const date = new Date();
export const listingStub = (overrides: Partial<Listing> = {}) => {
  const listing = new Listing();

  Object.assign(listing, {
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
  });

  Object.assign(listing, overrides);

  return listing;
};
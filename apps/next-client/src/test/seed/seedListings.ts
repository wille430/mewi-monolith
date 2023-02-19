import {createFakeListing} from "@/common/test/factories/createFakeListing";
import {Db} from "mongodb";
import {seedWith} from "./seedWith";
import {Listing} from "@mewi/entities";

export const seedListings = async (count: number, db: Db) =>
    seedWith(count, db.collection<Listing>("listings"), createFakeListing);

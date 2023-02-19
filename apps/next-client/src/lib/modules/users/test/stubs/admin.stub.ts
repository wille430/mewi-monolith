import type {WithId} from "@/lib/types/utils";
import mongoose from "mongoose";
import { User } from "@mewi/entities";
import { timestampsStub } from "@/test/stubs/timestamps.stub";
import {LoginStrategy, Role} from "@mewi/models";

const id = "633036188f8fd81317025659";
export const adminStub = (): WithId<User> & { password: string } => ({
    _id: new mongoose.Types.ObjectId(id),
    id: id,
    email: "admin@mewi.se",
    password: "wimxf5kxjzg1mgczzvj2iwgjlgwx4cbh",
    roles: [Role.ADMIN, Role.USER],
    loginStrategy: LoginStrategy.LOCAL,
    premium: true,
    likedListings: [],
    ...timestampsStub(),
});

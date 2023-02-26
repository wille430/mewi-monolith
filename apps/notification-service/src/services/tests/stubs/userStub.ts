import { User } from "@mewi/entities";
import { mongoose } from "@typegoose/typegoose";
import { LoginStrategy, Role } from "@mewi/models";

const id = "6330360f919579b678e3d048";
export const userStub = (): User => ({
  _id: new mongoose.Types.ObjectId(id) as any,
  id: id,
  email: "ike.carroll@hotmail.com",
  password: "wimxf5kxjzg1mgczzvj2iwgjlgwx4cbh",
  roles: [Role.USER],
  loginStrategy: LoginStrategy.LOCAL,
  premium: true,
  likedListings: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

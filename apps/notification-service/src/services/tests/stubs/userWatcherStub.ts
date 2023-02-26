import { mongoose } from "@typegoose/typegoose";
import { UserWatcher } from "@mewi/entities";
import { watcherStub } from "./watcherStub";
import { userStub } from "./userStub";

const id = "6336ec2f0fce785ab7fb1d31";
export const userWatcherStub = (): UserWatcher => ({
  _id: new mongoose.Types.ObjectId(id) as any,
  id,
  user: userStub() as any,
  watcher: watcherStub() as any,
  createdAt: new Date(),
  notifiedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
  updatedAt: new Date(),
});

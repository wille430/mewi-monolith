import { Watcher } from "@mewi/entities";
import { mongoose } from "@typegoose/typegoose";

const notifiedAt = new Date(Date.now() - 99999);
const id = "6335c3600ad468323536e432";

export const watcherStub = (): Watcher => ({
  _id: new mongoose.Types.ObjectId(id) as any,
  id: id,
  metadata: {
    keyword: "volvo",
  },
  notifiedAt: notifiedAt,
  updatedAt: new Date(),
  createdAt: new Date(),
});

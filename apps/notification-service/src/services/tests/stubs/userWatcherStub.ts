import {mongoose} from "@typegoose/typegoose"
import {UserWatcher, UserWatcherOptions} from "@mewi/entities"
import {watcherStub} from "./watcherStub"
import {userStub} from "./userStub"
import {NotifInterval} from "@mewi/models"

const id = "6336ec2f0fce785ab7fb1d31";
export const userWatcherStub = (): UserWatcher => {
  const userWatcher = new UserWatcher();

  userWatcher._id = new mongoose.Types.ObjectId(id) as any;
  userWatcher.id = id;
  userWatcher.user = userStub() as any;
  userWatcher.watcher = watcherStub() as any;
  userWatcher.createdAt = new Date();
  userWatcher.notifiedAt = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
  userWatcher.updatedAt = new Date();

  const options = new UserWatcherOptions();
  options.notifyInterval = NotifInterval.DEFAULT;
  userWatcher.options = options;

  return userWatcher;
};

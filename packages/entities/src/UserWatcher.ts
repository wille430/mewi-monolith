import type { Ref } from "@typegoose/typegoose";
import { getModelForClass, prop, ReturnModelType } from "@typegoose/typegoose";
import type { Document } from "mongoose";
import mongoose from "mongoose";
import { Watcher } from "./Watcher";
import { User } from "./User";
import { NotifInterval, UserWatcherDto } from "@mewi/models";
import { Entity } from "./Entity";

export type UserWatcherDocument = UserWatcher & Document;

export class UserWatcherOptions {
  @prop()
  notifyInterval?: NotifInterval;
}

export class UserWatcher extends Entity {
  id!: string;

  @prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Watcher.name,
    required: true,
  })
  watcher!: Ref<Watcher>;

  @prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user!: Ref<User>;

  @prop(Date)
  notifiedAt?: Date;

  @prop({
    required: true,
    default: {},
  })
  options: UserWatcherOptions;

  public static convertToDto(obj: UserWatcher): UserWatcherDto {
    return {
      id: obj._id.toString(),
      watcher: Watcher.convertToDto(obj.watcher as any),
      notifiedAt: obj.notifiedAt,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      options: {
        notifInterval: obj.options.notifyInterval ?? NotifInterval.DEFAULT,
      },
    };
  }

  private static DAY_MS = 24 * 60 * 60 * 1000;
  private static WEEK_MS = 7 * UserWatcher.DAY_MS;

  public getNotifyIntervalMs(): number {
    switch (this.options?.notifyInterval ?? NotifInterval.DEFAULT) {
      case NotifInterval.BIWEEKLY:
        return UserWatcher.WEEK_MS / 2;
      case NotifInterval.DAILY:
        return UserWatcher.DAY_MS;
      case NotifInterval.DEFAULT:
        return UserWatcher.DAY_MS * 2;
      case NotifInterval.MONTHLY:
        return UserWatcher.WEEK_MS * 4;
      case NotifInterval.WEEKLY:
        return UserWatcher.WEEK_MS;
    }
  }
}

export const UserWatcherModel: ReturnModelType<typeof UserWatcher> =
  getModelForClass(UserWatcher, {
    schemaOptions: {
      id: true,
      timestamps: true,
      toObject: { virtuals: true },
      toJSON: { virtuals: true },
    },
  });

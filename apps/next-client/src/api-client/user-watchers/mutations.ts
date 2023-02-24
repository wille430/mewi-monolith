import type { CreateWatcherDto } from "@/lib/modules/watchers/dto/create-watcher.dto";
import { client } from "../index";
import { UserWatcherDto } from "@mewi/models";

export const createUserWatcher = (data: CreateWatcherDto) => {
  return client.post<never, UserWatcherDto>("/user-watchers", data);
};

export const removeUserWatcher = (watcherId: string) => {
  return client.delete(`/user-watchers/${watcherId}`);
};

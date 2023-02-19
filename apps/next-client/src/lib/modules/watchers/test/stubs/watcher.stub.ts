import { timestampsStub } from "@/test/stubs/timestamps.stub";
import type { WithId } from "@/lib/types/utils";
import mongoose from "mongoose";
import {WatcherDto} from "@mewi/models";

const notifiedAt = new Date(Date.now() - 99999);
const id = "6335c3600ad468323536e432";
export const watcherStub = (): WithId<WatcherDto> => ({
    _id: new mongoose.Types.ObjectId(id),
    id: id,
    metadata: {
        keyword: "volvo",
    },
    notifiedAt: notifiedAt,
    ...timestampsStub(),
});

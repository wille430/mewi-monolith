import {createHandler} from "@/lib/middlewares/createHandler";
import { WatchersController } from "@/lib/modules/watchers/watchers.controller";

export default createHandler(WatchersController);

import {createHandler} from "@/lib/middlewares/createHandler";
import { MyWatchersController } from "@/lib/modules/user-watchers/user-watchers.controller";

export default createHandler(MyWatchersController);

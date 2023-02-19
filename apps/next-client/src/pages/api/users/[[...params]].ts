import {createHandler} from "@/lib/middlewares/createHandler";
import { UsersController } from "@/lib/modules/users/users.controller";

export default createHandler(UsersController);

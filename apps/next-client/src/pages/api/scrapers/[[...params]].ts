import {createHandler} from "@/lib/middlewares/createHandler";
import { ScrapersController } from "@/lib/modules/scrapers/scrapers.controller";

export default createHandler(ScrapersController);

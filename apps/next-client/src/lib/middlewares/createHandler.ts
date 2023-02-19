import flow from "lodash/flow";
import {mongodbMiddleware} from "@/lib/middlewares/mongodbMiddleware";
import {createHandler as defaultCreateHandler} from "next-api-decorators";

export const createHandler = flow(defaultCreateHandler, mongodbMiddleware);
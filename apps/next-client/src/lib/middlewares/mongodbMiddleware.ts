import {dbConnection} from "@/lib/dbConnection";
import {NextApiHandler} from "next";

export const mongodbMiddleware = (handler: NextApiHandler) => async (req, res) => {
    await dbConnection();
    return handler(req, res);
};
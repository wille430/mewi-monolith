import "reflect-metadata";
import { dbConnection } from "@/lib/dbConnection";

export const createServerSideFunc = <T = void, R = any>(
  func: (args: T) => R
): ((args: T) => Promise<R>) => {
  return async (args: T) => {
    await dbConnection();
    return func(args);
  };
};

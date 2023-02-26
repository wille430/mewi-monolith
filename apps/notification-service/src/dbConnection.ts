import { mongoose } from "@typegoose/typegoose";
import * as assert from "assert";

let cached: any;

if (!cached) {
  cached = { conn: null, promise: null };
}

export const connectMongoose = async () => {
  assert(process.env.MONGO_URI);
  await dbConnection();
};

export const dbConnection = async (): Promise<mongoose.Connection> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        return mongoose.connection;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

import mongoose from "mongoose";

const DATABASE_URI = process.env.DATABASE_URI;

if (!DATABASE_URI) {
    throw new Error("Environment variable DATABASE_URI is not defined");
}

let cached: any;

if (!cached) {
    cached = { conn: null, promise: null };
}

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

        cached.promise = mongoose.connect(DATABASE_URI, opts).then((mongoose) => {
            return mongoose.connection;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

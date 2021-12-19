const mongoose = require("mongoose");

const { MONGO_URI, MONGO_USERNAME, MONGO_PASSWORD } = process.env

let url;

if (!MONGO_USERNAME || !MONGO_PASSWORD) {
    url = "mongodb://" + MONGO_URI
} else {
    url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_URI}`;
}

const database = {
    connect: () => {
        // Connecting to the database
        mongoose
            .connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => {
                console.log("Successfully connected to database");
            })
            .catch((error) => {
                console.log("database connection failed. exiting now...");
                console.error(error);
                process.exit(1);
            });
    }
}

export default database
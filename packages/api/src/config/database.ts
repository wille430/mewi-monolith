import mongoose from 'mongoose'

const { MONGO_URI, MONGO_USERNAME, MONGO_PASSWORD } = process.env

let url

if (!MONGO_USERNAME || !MONGO_PASSWORD) {
    url = 'mongodb://' + MONGO_URI
} else {
    url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_URI}`
}

const database = {
    connect: () => {
        const options: mongoose.ConnectOptions = {}

        // Connecting to the database
        mongoose
            .connect(url, options)
            .then(() => {
                console.log('Successfully connected to database')
            })
            .catch((error) => {
                console.log('database connection failed. exiting now...')
                console.error(error)
                process.exit(1)
            })
    },
}

export default database

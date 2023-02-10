import {Connection, connect} from "amqplib"

let connection: Connection | null

export const getConnection = async (): Promise<Connection> => {
    const connectionString = process.env.MQ_CONNECTION_STRING

    if (connectionString == null) throw new Error("Environment variable MQ_CONNECTION_STRING cannot be null")

    if (connection == null) {
        console.log(`Connecting to MQ at ${connectionString}...`)
        connection = await connect(connectionString)
        console.log(`Connected: ${connection != null}`)
    }

    return connection
}
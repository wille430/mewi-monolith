import {autoInjectable} from "tsyringe"
import {Channel, connect, Connection} from "amqplib"
import assert from "assert"

@autoInjectable()
export class MessageBroker {
    private readonly connectionString = process.env.MQ_CONNECTION_STRING
    private _connection: Connection | null = null
    private _channel: Channel | null = null

    constructor() {
        assert(this.connectionString)
    }

    private async getConnection(): Promise<Connection> {
        if (!this._connection) {
            this._connection = await connect(this.connectionString)
        }

        return this._connection
    }

    private async getChannel(): Promise<Channel> {
        if (!this._channel) {
            const conn = await this.getConnection()
            this._channel = await conn.createChannel()
        }

        return this._channel
    }

    public async sendMessage(queue: string, msg: any): Promise<boolean> {
        try {
            const channel = await this.getChannel()
            await channel.assertQueue(queue)

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)))
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }
}
import {Channel, connect, Connection, ConsumeMessage, Replies} from "amqplib"
import * as assert from "assert"

export type Consumer = (channel: Channel, ...args: any[]) => (msg: ConsumeMessage) => Promise<void>

export class MessageBroker {
    private readonly connectionString: string
    private _connection: Connection | null = null
    private _channel: Channel | null = null

    constructor(connectionString: string) {
        assert(connectionString)

        this.connectionString = connectionString
    }

    private async getConnection(): Promise<Connection> {
        if (!this._connection) {
            this._connection = await connect(this.connectionString)
            console.log(`[@mewi/mqlib]: connection established to ${this.connectionString}`)
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

    /**
     * amqplib wrapper for the consume function
     * @param queue     - the queue name
     * @param consumer  - a function that returns a function which handles incoming messages
     * @param args      - a list of arguments to pass to the consumer function
     */
    public async consume(queue: string, consumer: Consumer, ...args: any[]): Promise<Replies.Consume> {
        const channel = await this.getChannel()
        await channel.assertQueue(queue)

        return channel.consume(queue, consumer(channel, ...args))
    }
}

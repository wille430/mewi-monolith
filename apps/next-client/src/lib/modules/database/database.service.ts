import { Connection } from 'mongoose'
import { autoInjectable, inject } from 'tsyringe'

@autoInjectable()
export class DatabaseService {
    constructor(@inject(Connection) private readonly connection: Connection) {}

    getDbHandle(): Connection {
        return this.connection
    }
}

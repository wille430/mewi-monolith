import 'reflect-metadata'
import { container } from 'tsyringe'
import { EventHandler } from '../event-handler.service'

export const OnEvent = (event: string | symbol) => {
    const eventHandler = container.resolve(EventHandler)
    return (target: any, key: any, descriptor: any) => {
        eventHandler.register({
            name: event,
            method: descriptor.value,
            thisArgument: target,
        })
    }
}

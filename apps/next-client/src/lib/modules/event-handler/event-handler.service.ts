import { Event } from './types/event.type'

export class EventHandler {
    private events: Record<Event['name'], Event> = {}

    register<T extends any[], K>(event: Event<T, K>) {
        this.events[event.name] = event
    }

    emit(name: Event['name'], args: any) {
        const event = this.events[name]
        Reflect.apply(event.method, event.thisArgument, args).then((res) => console.log(res))
    }
}

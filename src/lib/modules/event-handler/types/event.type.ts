export type Event<T extends any[] = any[], K = any> = {
    name: string | symbol
    method: (...args: T) => K
    thisArgument: any
}

export type ExtendedModel<T = any> = T & {
    improvedAggregate: (...args: Parameters<T['aggregateRaw']>) => ReturnType<T['findMany']>[]
}

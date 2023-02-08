export type AnyRecord<T> = {
    [P in keyof T]: any
}

export type AnyRecordDeep<T> = {
    [P in keyof T]: T[P] extends Record<any, any> ? AnyRecord<T[P]> : any
}

export type AnyRecord<T> = {
    [P in keyof T]: any
}

export type FormError<T> = { [key in keyof Partial<T>]: string } & { all?: string }

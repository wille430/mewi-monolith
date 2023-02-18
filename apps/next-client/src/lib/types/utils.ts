
export type AnyRecord<T> = {
    [P in keyof T]: any
}

export type WithId<T> = Omit<T, "_id"> & { _id: any }
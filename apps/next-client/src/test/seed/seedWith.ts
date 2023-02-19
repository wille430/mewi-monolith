import { Collection } from "mongodb";

export const seedWith = async <T = any>(
    count: number,
    // @ts-ignore
    collection: Collection<T>,
    createEntity: (...args: any) => T
) => {
    const entities = Array(count)
        .fill(null)
        .map<T>(() => createEntity());
    return collection.insertMany(entities as any);
};

export const createMany = async <T, R>(
    num: number,
    create: (args: Partial<T> | undefined) => Promise<R> | R,
    attrs?: Partial<T>
) => {
    const records: R[] = []

    for (let i = 0; i < num; i++) {
        records.push(await create(attrs))
    }

    return records
}

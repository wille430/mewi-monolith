import { CreateFactoryReturn } from 'prisma-factory'

export const createMany = async <T, R>(
    num: number,
    create: CreateFactoryReturn<T, R>['create'],
    attrs?: Partial<T>
) => {
    let records: R[] = []

    for (let i = 0; i < num; i++) {
        records.push(await create(attrs))
    }

    return records
}

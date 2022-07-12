/**
 * Aggregation which returns objects which conform to the prisma JSON shape
 *
 * @param args - Aggregation arguments
 * @returns Array of the specified models documents
 */
export async function improvedAggregate<T extends Record<string, any>>(
    model: T,
    args: Parameters<T['aggregateRaw']>[0] & { pipeline: any[] }
): Promise<Awaited<ReturnType<T['findMany']>>> {
    if (!args.pipeline) args.pipeline = []

    args.pipeline.push({
        $group: { _id: null, array: { $push: '$_id' } },
    })
    const ids = await this.aggregateRaw(args).then((o) => o[0]['array'].map((o) => o.$oid))

    return this.findMany({
        where: {
            id: { in: ids },
        },
    })
}

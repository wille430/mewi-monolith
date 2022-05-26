import { ListingOrigin, Prisma, ScrapingLog } from '@mewi/prisma/index-browser'
import axios from 'axios'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { Chart, AxisOptions } from 'react-charts'

type Series = {
    label: string
    data: Partial<ScrapingLog>[]
}

export const ScraperLogs = () => {
    const { data, isLoading } = useQuery(
        'scraperLogs',
        (): Promise<Series[]> =>
            axios
                .get<ScrapingLog[]>('/scrapers/logs', {
                    params: {
                        where: {
                            createdAt: {
                                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toDateString(),
                            },
                        },
                    } as Prisma.ScrapingLogFindManyArgs,
                })
                .then(({ data }) => {
                    const series: Series[] = []

                    for (const key of Object.keys(ListingOrigin)) {
                        series.push({
                            label: key,
                            data: data.filter((x) => x.target === key),
                        })
                    }

                    return series
                })
                .catch((e) => []),
        {
            initialData: [],
        }
    )

    const primaryAxis = useMemo(
        (): AxisOptions<ScrapingLog> => ({
            getValue: (log) => new Date(log.createdAt),
            scaleType: 'time',
        }),
        []
    )

    const secondaryAxes = useMemo(
        (): AxisOptions<ScrapingLog>[] => [
            {
                getValue: (log) => log.total_count,
            },
        ],
        []
    )

    if (isLoading || !data.length) {
        return null
    }

    return (
        <div
            className='bg-white rounded border border-gray-300'
            style={{
                width: '100%',
                height: '16rem',
            }}
        >
            <Chart
                options={{
                    data,
                    primaryAxis,
                    secondaryAxes,
                }}
            />
        </div>
    )
}

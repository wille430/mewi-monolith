import type { IScrapingLog } from '@wille430/common'
import { ListingOrigin } from '@wille430/common'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import type { AxisOptions, UserSerie } from 'react-charts'
import { Chart } from 'react-charts'
import { client } from '@/lib/client'

type Series = {
    label: string
    data: Partial<IScrapingLog>[]
}

export const ScraperLogs = () => {
    const { data, isLoading } = useQuery(
        'scraperLogs',
        (): Promise<Series[]> =>
            client
                .post<IScrapingLog[]>('/scrapers/logs', {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    },
                    take: 20,
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
        (): AxisOptions<IScrapingLog> => ({
            getValue: (log) => new Date(log.createdAt),
            scaleType: 'time',
        }),
        []
    )

    const secondaryAxes = useMemo(
        (): AxisOptions<IScrapingLog>[] => [
            {
                getValue: (log) => log.addedCount,
            },
        ],
        []
    )

    if (isLoading || !data || !data?.length) {
        return null
    }

    return (
        <div
            className='rounded border border-gray-300 bg-white'
            style={{
                width: '100%',
                height: '16rem',
            }}
        >
            <Chart
                options={{
                    data: data as UserSerie<IScrapingLog>[],
                    primaryAxis,
                    secondaryAxes,
                }}
            />
        </div>
    )
}

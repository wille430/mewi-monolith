import { ListingOrigin, Prisma } from '@mewi/prisma/index-browser'
import { Button, ButtonProps } from '@mewi/ui'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ScraperStatus } from '@wille430/common'
import { ScraperLogs } from '../ScraperLogs/ScraperLogs'
import StyledLoader from '../StyledLoader'
import Checkbox from '@/components/Checkbox/Checkbox'

export const ScraperPanel = () => {
    const queryClient = useQueryClient()
    const [selectedScrapers, setSelectedScrapers] = useState<
        Partial<Record<ListingOrigin, boolean>>
    >({})

    const initialScraperStatus = useMemo(() => {
        const scraperStatus: Record<string, ScraperStatus> = {}

        for (const key of Object.keys(ListingOrigin)) {
            scraperStatus[key] = {
                started: false,
                listings_current: 0,
                listings_remaining: 0,
            }
        }

        return scraperStatus
    }, [])

    const { data: scraperStatus } = useQuery<Record<ListingOrigin, ScraperStatus>>(
        'scrapers',
        () => axios.get('/scrapers/status').then((res) => res.data),
        {
            initialData: initialScraperStatus,
            refetchInterval: 15000,
            refetchIntervalInBackground: true,
        }
    )

    const startScrapers = useMutation(
        () =>
            axios
                .post('/scrapers/start', {
                    scrapers: Object.keys(selectedScrapers).filter(
                        (key) => selectedScrapers[key] === true
                    ),
                })
                .then((res) => res.data),
        {
            onSuccess: (data) => {
                queryClient.setQueryData('scrapers', {
                    ...scraperStatus,
                    ...data.scraper_status,
                })
            },
        }
    )

    const isAllSelected = useMemo(
        () =>
            Object.keys(ListingOrigin).length <=
            Object.keys(selectedScrapers).filter((x) => selectedScrapers[x] === true).length,
        [selectedScrapers]
    )

    useEffect(() => {
        queryClient.fetchQuery('scraperLogs')
    }, [scraperStatus])

    return (
        <div className='p-2 space-y-2'>
            <h4>Webbskrapare</h4>
            <div className='space-y-4 rounded bg-gray-150 p-2'>
                <table className='table-auto'>
                    <thead>
                        <tr className='text-gray-500 font-thin text-sm '>
                            <th className='w-32 text-left'>Skrapare</th>
                            <th>Produkter</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {Object.keys(scraperStatus).map((key) => {
                            const status = scraperStatus[key as ListingOrigin]

                            return (
                                <tr key={key}>
                                    <td>
                                        {scraperStatus[key as ListingOrigin].started ? (
                                            <div className='flex items-center space-x-2'>
                                                <StyledLoader height='1rem' width='1rem' />
                                                <span>{key}</span>
                                            </div>
                                        ) : (
                                            <Checkbox
                                                label={key}
                                                onClick={() =>
                                                    setSelectedScrapers((prev) => ({
                                                        ...prev,
                                                        [key]: !selectedScrapers[key],
                                                    }))
                                                }
                                                checked={selectedScrapers[key]}
                                            />
                                        )}
                                    </td>

                                    <td className='px-4'>
                                        {`${status.listings_current} / ${
                                            status.listings_current + status.listings_remaining
                                        }`}
                                    </td>

                                    <td>
                                        {status.started === true && (
                                            <span className='text-green-600'>Skrapar...</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className='flex space-x-2'>
                    <Button
                        label='Starta valda'
                        disabled={!Object.keys(selectedScrapers).length}
                        onClick={() => startScrapers.mutate()}
                    />

                    {isAllSelected ? (
                        <Button
                            label='Avmarkera'
                            variant='outlined'
                            onClick={async () => {
                                setSelectedScrapers({})
                            }}
                        />
                    ) : (
                        <Button
                            label='Välj alla'
                            variant='outlined'
                            onClick={async () => {
                                setSelectedScrapers(
                                    Object.keys(ListingOrigin).reduce(
                                        (o, key) => ((o[key] = true), o),
                                        {}
                                    )
                                )
                            }}
                        />
                    )}

                    <DeleteButton
                        selected={
                            Object.keys(selectedScrapers).filter(
                                (key) => selectedScrapers[key] === true
                            ) as ListingOrigin[]
                        }
                    />
                </div>

                <ScraperLogs />
            </div>
        </div>
    )
}

export const DeleteButton = ({
    selected,
    ...props
}: ButtonProps & { selected: ListingOrigin[] }) => {
    const queryClient = useQueryClient()
    const mutation = useMutation(
        async () =>
            // Delete listings from selected origins
            await axios.delete('/listings', {
                data: {
                    where: {
                        origin: {
                            in: selected,
                        },
                    },
                } as Prisma.ListingDeleteManyArgs,
            }),
        {
            onMutate: () => queryClient.refetchQueries('scrapers'),
        }
    )

    return (
        <Button
            {...props}
            label='Töm'
            color='error'
            onClick={() => mutation.mutate()}
            disabled={mutation.isLoading}
        />
    )
}

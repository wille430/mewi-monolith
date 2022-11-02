import { ListingOrigin } from '@/common/schemas'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { formatDistance } from 'date-fns'
import { sv } from 'date-fns/locale'
import { GiPauseButton } from 'react-icons/gi'
import { BsSkipForward } from 'react-icons/bs'
import { IoMdHammer } from 'react-icons/io'
import StyledLoader from '../StyledLoader'
import { Table } from '../Table/Table'
import { Button, ButtonProps } from '../Button/Button'
import { client } from '@/lib/client'
import Checkbox from '@/components/Checkbox/Checkbox'
import { ScraperStatus, ScraperStatusReport } from '@/common/types'

const scraperStatusIconMap: Record<ScraperStatus, JSX.Element> = {
    IDLE: (
        <>
            <GiPauseButton className='mr-2' />
            Pausad
        </>
    ),
    QUEUED: (
        <>
            <BsSkipForward className='mr-2' />
            Köad
        </>
    ),
    SCRAPING: (
        <>
            <IoMdHammer className='mr-2' />
            Skrapar...
        </>
    ),
}

export const ScraperPanel = () => {
    const queryClient = useQueryClient()
    const [selectedScrapers, setSelectedScrapers] = useState<
        Partial<Record<ListingOrigin, boolean>>
    >({})

    const initialScraperStatus = useMemo(() => {
        const scraperStatus: Record<string, ScraperStatusReport> = {}

        for (const key of Object.keys(ListingOrigin)) {
            scraperStatus[key] = {
                started: false,
                listings_current: 0,
                status: ScraperStatus.IDLE,
                listings_remaining: 0,
                last_scraped: new Date(),
            }
        }

        return scraperStatus
    }, [])

    const { data: scraperStatus } = useQuery<Record<ListingOrigin, ScraperStatusReport>>(
        'scrapers',
        () => client.get('/scrapers/status').then((res) => res.data),
        {
            initialData: initialScraperStatus,
            refetchInterval: 1000,
            refetchIntervalInBackground: true,
        }
    )

    const startScrapers = useMutation(
        () =>
            client
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
        <div className='space-y-2 p-4'>
            <h4>Webbskrapare</h4>
            <div className='bg-gray-150 overflow-hidden rounded'>
                <Table className='table-auto'>
                    <thead>
                        <tr>
                            <th className='w-32 text-left'>Skrapare</th>
                            <th>Produkter</th>
                            <th>Senast skrapad</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Object.keys(scraperStatus ?? []).map((key) => {
                            if (!scraperStatus) return null
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

                                    <td>
                                        {`${status.listings_current} / ${
                                            status.listings_current + status.listings_remaining
                                        }`}
                                    </td>

                                    <td>
                                        {status.last_scraped
                                            ? formatDistance(
                                                  new Date(status.last_scraped),
                                                  new Date(),
                                                  {
                                                      addSuffix: true,
                                                      locale: sv,
                                                  }
                                              ).replace('ungefär', 'ca.')
                                            : 'Aldrig'}
                                    </td>

                                    <td>
                                        <span className='flex items-center text-gray-400'>
                                            {scraperStatusIconMap[status.status]}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <div className='flex space-x-2 p-4'>
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
            await client.delete('/listings', {
                data: {
                    origin: selected,
                },
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

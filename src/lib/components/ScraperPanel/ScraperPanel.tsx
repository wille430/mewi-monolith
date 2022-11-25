import { ListingOrigin } from '@/common/schemas'
import { useMemo, useState } from 'react'
import { formatDistance } from 'date-fns'
import { sv } from 'date-fns/locale'
import { GiPauseButton } from 'react-icons/gi'
import { BsSkipForward } from 'react-icons/bs'
import { IoMdHammer } from 'react-icons/io'
import { Table } from '../Table/Table'
import { Button, ButtonProps } from '../Button/Button'
import Checkbox from '@/lib/components/Checkbox/Checkbox'
import { ScraperStatus, ScraperStatusReport } from '@/common/types'
import useSWR, { useSWRConfig } from 'swr'
import { SCRAPERS_STATUS_KEY } from '@/lib/client/scrapers/swr-keys'
import { getScrapersStatus } from '@/lib/client/scrapers/queries'
import { deleteListingsFrom, startScrapers } from '@/lib/client/scrapers/mutations'

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
    const { mutate } = useSWRConfig()
    const [selectedScrapers, setSelectedScrapers] = useState<
        Partial<Record<ListingOrigin, boolean>>
    >({})

    const initialScraperStatus = useMemo(() => {
        const scraperStatus: Record<string, ScraperStatusReport> = {}

        for (const key of Object.keys(ListingOrigin)) {
            scraperStatus[key] = {
                listings_current: 0,
                listings_remaining: 0,
                last_scraped: new Date(),
            }
        }

        return scraperStatus
    }, [])

    const { data: scraperStatus = initialScraperStatus } = useSWR(
        SCRAPERS_STATUS_KEY,
        getScrapersStatus
    )

    const isAllSelected = useMemo(
        () =>
            Object.keys(ListingOrigin).length <=
            Object.keys(selectedScrapers).filter((x) => selectedScrapers[x] === true).length,
        [selectedScrapers]
    )

    return (
        <div className='space-y-2 p-4'>
            <h4>Webbskrapare</h4>
            <div className='bg-gray-150 overflow-hidden rounded'>
                <Table className='table-auto'>
                    <thead>
                        <tr>
                            <th className='text-left'>Skrapare</th>
                            <th>Produkter</th>
                            <th>Senast skrapad</th>
                        </tr>
                    </thead>

                    <tbody>
                        {Object.keys(scraperStatus ?? []).map((key) => {
                            if (!scraperStatus) return null
                            const status = scraperStatus[key as ListingOrigin]

                            return (
                                <tr key={key}>
                                    <td>
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
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <div className='flex space-x-2 p-4'>
                    <Button
                        label='Starta valda'
                        disabled={!Object.keys(selectedScrapers).length}
                        onClick={() =>
                            mutate(
                                ...startScrapers(
                                    Object.keys(selectedScrapers).filter(
                                        (key) => selectedScrapers[key] === true
                                    ) as ListingOrigin[]
                                )
                            )
                        }
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
    const { mutate } = useSWRConfig()

    return (
        <Button
            {...props}
            label='Töm'
            color='error'
            onClick={() => mutate(...deleteListingsFrom(selected))}
        />
    )
}

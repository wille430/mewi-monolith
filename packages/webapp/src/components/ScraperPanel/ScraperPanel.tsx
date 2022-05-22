import { ListingOrigin } from '@mewi/prisma/index-browser'
import { Button } from '@mewi/ui'
import axios from 'axios'
import { useMemo, useState } from 'react'
import Checkbox from '@/components/Checkbox/Checkbox'

export const ScraperPanel = () => {
    const [selectedScrapers, setSelectedScrapers] = useState<
        Partial<Record<ListingOrigin, boolean>>
    >({})
    const [scraperStatus, setScraperStatus] = useState<Partial<Record<ListingOrigin, boolean>>>({})

    const startScrapers = async () => {
        const scraperTargetsArray = Object.keys(selectedScrapers).filter(
            (key) => selectedScrapers[key] === true
        )

        const { data } = await axios
            .post('/scrapers/start', {
                scrapers: scraperTargetsArray,
            })
            .catch((e) => {
                throw e
            })

        setScraperStatus(data.scraper_status)
    }

    const isAllSelected = useMemo(
        () =>
            Object.keys(ListingOrigin).length <=
            Object.keys(selectedScrapers).filter((x) => selectedScrapers[x] === true).length,
        [selectedScrapers]
    )

    return (
        <div className='p-2 space-y-2'>
            <h4>Webbskrapare</h4>
            <div className='space-y-4 rounded bg-gray-150 p-2'>
                <ul>
                    {Object.keys(ListingOrigin).map((key) => (
                        <li className='flex' key={key}>
                            <div className='w-32'>
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
                            </div>

                            {typeof scraperStatus[key] === 'undefined' ? null : scraperStatus[
                                  key
                              ] === true ? (
                                <span className='text-green-600'>Skrapningen startades</span>
                            ) : (
                                <span className='text-red-500'>Ett fel inträffade</span>
                            )}
                        </li>
                    ))}
                </ul>
                <div className='flex space-x-2'>
                    <Button
                        label='Starta valda'
                        disabled={!Object.keys(selectedScrapers).length}
                        onClick={startScrapers}
                    />

                    {
                        // True if all scrapers are selected
                        isAllSelected ? (
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
                        )
                    }
                </div>
            </div>
        </div>
    )
}

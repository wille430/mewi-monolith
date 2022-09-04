import { useListingFilters } from '@/hooks/useListingFilters'
import { toggleCategory } from '@/utils/toggleCategory'
import { categories } from '@wille430/common'
import { Button, Container, TextField } from '@wille430/ui'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import Checkbox from '../Checkbox/Checkbox'
import { CreateWatcherButton } from '../CreateWatcherButton/CreateWatcherButton'
import { PriceRangeFilter } from '../PriceRangeFilter/PriceRangeFilter'

export const SideFilters = () => {
    const { filters, setFilters, setField, clear } = useListingFilters()
    const [addWatcherStatus, setAddWatcherStatus] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        const reset = () => {
            setAddWatcherStatus(undefined)
        }
        window.addEventListener('click', reset)

        return () => {
            window.removeEventListener('click', reset)
        }
    })

    return (
        <aside className='ml-auto md:max-w-xxs'>
            <Container className='flex space-y-4'>
                <h3>Filter</h3>

                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:block md:space-y-4'>
                    <div>
                        <h4>Kategorier</h4>
                        <ul className='list-none'>
                            {categories.map((x) => (
                                <li className='mx-2 hover:cursor-pointer' key={x.value}>
                                    <Checkbox
                                        label={x.label}
                                        name={`category-${x.value}`}
                                        onClick={(val) => toggleCategory(x.value, val, setFilters)}
                                        checked={filters.categories?.includes(x.value)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4>Plats</h4>

                        <TextField
                            placeholder='Plats (stad, region, etc)'
                            name='region'
                            showLabel={false}
                            onChange={setField}
                            value={filters.region}
                            data-testid='regionInput'
                            fullWidth
                        />
                    </div>

                    <div>
                        <h4>Prisintervall</h4>

                        <PriceRangeFilter
                            lte={filters.priceRangeLte}
                            gte={filters.priceRangeGte}
                            onChange={(key, val) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    [key]: val,
                                }))
                            }
                            data-testid='priceRangeSlider'
                        />
                    </div>

                    <div className='ml-4'>
                        <Checkbox
                            label='Auktion'
                            name='auction'
                            data-testid='auctionCheckbox'
                            checked={filters.auction}
                            onClick={(val) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    auction: val,
                                }))
                            }
                        />
                    </div>
                </div>

                {/* TODO */}
                <div className='flex flex-col justify-end space-y-2'>
                    <Button label='Rensa' onClick={clear} />
                    <CreateWatcherButton
                        label='Bevaka sökning'
                        variant='outlined'
                        filters={filters}
                        setError={() => setAddWatcherStatus(false)}
                        onSuccess={() => setAddWatcherStatus(true)}
                    />
                    <span
                        className={clsx([
                            addWatcherStatus === true ? 'text-green-400' : 'text-red-400',
                            addWatcherStatus === undefined && 'hidden',
                        ])}
                    >
                        {addWatcherStatus
                            ? 'Bevakningen lades till!'
                            : 'Kunde inte lägga till bevakning. Försök igen senare.'}
                    </span>
                </div>
            </Container>
        </aside>
    )
}

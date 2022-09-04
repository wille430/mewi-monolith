import { useListingFilters } from '@/hooks/useListingFilters'
import { navigateToCategoryUrl } from '@/utils/navigateToCategoryUrl'
import { categories } from '@wille430/common'
import { Button, Container, TextField } from '@wille430/ui'
import Link from 'next/link'
import Checkbox from '../Checkbox/Checkbox'
import { CreateWatcherButton } from '../CreateWatcherButton/CreateWatcherButton'
import { PriceRangeFilter } from '../PriceRangeFilter/PriceRangeFilter'

export const SideFilters = () => {
    const { filters, setFilters, setField, clear } = useListingFilters()

    return (
        <aside className='ml-auto max-w-xxs'>
            <Container className='space-y-4'>
                <h3>Filter</h3>

                <div>
                    <h4>Kategorier</h4>
                    <ul className='list-none'>
                        {categories.map((x) => (
                            <li className='mx-2 hover:cursor-pointer'>
                                {/* <Checkbox label={x.label} name={`category-${x.value}`} /> */}
                                <Link href={navigateToCategoryUrl(x.value)}>{x.label}</Link>
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

                {/* TODO */}
                <div className='flex justify-end space-x-2'>
                    <span className='text-red-400'>{}</span>
                    <CreateWatcherButton
                        label='Bevaka sökning'
                        variant='outlined'
                        filters={filters}
                        setError={() => {}}
                        onSuccess={() => ''}
                    />
                    <Button label='Rensa' onClick={clear} />
                </div>
            </Container>
        </aside>
    )
}

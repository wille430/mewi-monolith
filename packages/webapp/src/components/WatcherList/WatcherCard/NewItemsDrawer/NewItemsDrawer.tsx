import { ListingRow } from '@/components/ListingRow/ListingRow'
import { motion } from 'framer-motion'
import styles from './NewItemsDrawer.module.scss'
import { PopulatedUserWatcher } from '@wille430/common'
import { Listing } from '@mewi/prisma'
import StyledLoader from '@/components/StyledLoader'
// import { openListing } from '@/store/search/creators'
import { useQuery } from 'react-query'
import axios from 'axios'
import queryString from 'query-string'
import { openListing } from '@/store/listings'
import { useAppDispatch } from '@/hooks'
import classNames from 'classnames'

interface NewItemsDrawerProps {
    newItems: Listing[]
    watcher: PopulatedUserWatcher
}

const removeNullValues = (obj: Record<any, any>) => {
    return Object.keys(obj)
        .filter((key) => !!obj[key])
        .reduce((o, v) => ((o[v] = obj[v]), o), {})
}

const NewItemsDrawer = ({ newItems, watcher }: NewItemsDrawerProps) => {
    const LIMIT = 5

    const dispatch = useAppDispatch()

    const {
        data: _newItems,
        isLoading,
        error,
    } = useQuery(
        ['watcherListings', { id: watcher.id }],
        async () =>
            await axios
                .get(
                    '/listings?' +
                        queryString.stringify({
                            dateGte: watcher.createdAt,
                            limit: LIMIT,
                            ...removeNullValues(watcher.watcher.metadata),
                        })
                )
                .then((res) => res.data?.hits)
    )

    const drawerVariants = {
        hidden: {
            height: 0,
        },
        show: {
            height: _newItems?.length || newItems.length ? 'auto' : '3.5rem',
        },
    }

    const handleClick = (id: string) => {
        const itemToOpen = newItems.find((x) => x.id === id)
        if (itemToOpen) {
            dispatch(openListing(itemToOpen))
        }
    }

    const renderItems = () => {
        return [...newItems, ...(_newItems || [])].map((item) => (
            <ListingRow key={item.id} item={item} onClick={() => handleClick(item.id)} />
        ))
    }

    return (
        <motion.div
            className={classNames({
                [styles.itemDrawer]: true,
                [styles.empty]: !(_newItems?.length && newItems.length),
            })}
            variants={drawerVariants}
            initial='hidden'
            animate='show'
            exit='hidden'
            transition={{
                ease: 'easeInOut',
                duration: 0.25,
            }}
        >
            {(newItems.length || _newItems?.length) && !isLoading ? (
                <ul>
                    <span className='mb-1'>Nya föremål:</span>
                    {renderItems()}
                </ul>
            ) : isLoading ? (
                <div className='align-center flex w-full justify-center'>
                    <StyledLoader />
                </div>
            ) : error ? (
                <span className='mx-auto mt-2'>Ett fel inträffade</span>
            ) : (
                <span className='py-2 text-center'>Inga nya föremål hittades</span>
            )}
        </motion.div>
    )
}

export default NewItemsDrawer

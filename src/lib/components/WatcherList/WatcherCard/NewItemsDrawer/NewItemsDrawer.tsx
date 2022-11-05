import { motion } from 'framer-motion'
import type { IUserWatcher, IListing } from '@/common/schemas'
import classNames from 'classnames'
import styles from './NewItemsDrawer.module.scss'
import { openListing } from '@/lib/store/listings'
import { useAppDispatch } from '@/lib/hooks'
import StyledLoader from '@/lib/components/StyledLoader'
import { ListingRow } from '@/lib/components/ListingRow/ListingRow'
import useSWR from 'swr'
import { MY_WATCHERS_KEY } from '@/lib/client/user-watchers/swr-keys'
import { getWatcherItems } from '@/lib/client/user-watchers/queries'

interface NewItemsDrawerProps {
    newItems: IListing[]
    watcher: IUserWatcher
}

const NewItemsDrawer = ({ newItems, watcher }: NewItemsDrawerProps) => {
    const dispatch = useAppDispatch()

    const { data: _newItems, error } = useSWR(
        [MY_WATCHERS_KEY, { id: watcher.id }],
        getWatcherItems
    )
    const isLoading = !_newItems

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
            <ListingRow key={item.id} listing={item} onClick={() => handleClick(item.id)} />
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

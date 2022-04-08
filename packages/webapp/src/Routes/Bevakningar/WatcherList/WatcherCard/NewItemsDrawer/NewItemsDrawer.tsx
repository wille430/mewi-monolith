import ArticleItemRow from 'components/ArticleItemRow/ArticleItemRow'
import { useAppDispatch } from 'hooks/hooks'
import { motion } from 'framer-motion'
import styles from './NewItemsDrawer.module.scss'
import { IListing } from '@wille430/common'
import StyledLoader from 'components/StyledLoader'
import { openListing } from 'store/search/creators'
import { useQuery } from 'react-query'
import axios from 'axios'
import { IPopulatedWatcher } from '@wille430/common'
import queryString from 'query-string'

interface NewItemsDrawerProps {
    newItems: IListing[]
    watcher: IPopulatedWatcher
}

const NewItemsDrawer = ({ newItems, watcher }: NewItemsDrawerProps) => {
    const LIMIT = 5
    const dispatch = useAppDispatch()

    const {
        data: _newItems,
        isLoading,
        error,
    } = useQuery(
        ['watcherListings', { id: watcher._id }],
        async () =>
            await axios
                .get(
                    '/listings?' +
                        queryString.stringify({
                            dateGte: new Date(watcher.createdAt).getTime(),
                            limit: LIMIT,
                        })
                )
                .then((res) => res.data?.hits)
    )

    const drawerVariants = {
        hidden: {
            height: 0,
        },
        show: {
            height: !isLoading && (_newItems?.length || newItems.length) ? 'auto' : '7.5rem',
        },
    }

    const handleClick = (id: string) => {
        dispatch(openListing(newItems.find((x) => x.id === id)))
    }

    const renderItems = () => {
        return [...newItems, ...(_newItems || [])].map((item) => (
            <ArticleItemRow key={item.id} item={item} onClick={() => handleClick(item.id)} />
        ))
    }

    return (
        <motion.div
            className={styles.itemDrawer}
            variants={drawerVariants}
            initial='hidden'
            animate='show'
            exit='hidden'
            transition={{
                ease: 'easeInOut',
                duration: 0.25,
            }}
        >
            <ul>
                {(newItems.length || _newItems?.length) && !isLoading ? (
                    <>
                        <span className='mb-1'>Nya föremål:</span>
                        {renderItems()}
                    </>
                ) : isLoading ? (
                    <div className='align-center flex w-full justify-center'>
                        <StyledLoader />
                    </div>
                ) : (
                    <span className='py-2 text-center'>Inga nya föremål hittades</span>
                )}
            </ul>
        </motion.div>
    )
}

export default NewItemsDrawer

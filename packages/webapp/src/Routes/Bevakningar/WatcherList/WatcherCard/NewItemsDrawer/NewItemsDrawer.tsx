import ArticleItemRow from 'components/ArticleItemRow/ArticleItemRow'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { motion } from 'framer-motion'
import styles from './NewItemsDrawer.module.scss'
import { IListing } from '@mewi/common/types'
import { useEffect, useState } from 'react'
import { getNewItems } from 'store/watchers/creators'
import StyledLoader from 'components/StyledLoader'
import { openListing } from 'store/search/creators'

interface NewItemsDrawerProps {
    newItems: IListing[]
    watcherId: string
}

const NewItemsDrawer = ({ watcherId, newItems }: NewItemsDrawerProps) => {
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const _newItems = useAppSelector((state) => state.watchers.newItems)[watcherId] as
        | IListing[]
        | undefined

    const drawerVariants = {
        hidden: {
            height: 0,
        },
        show: {
            height: !isLoading && (_newItems?.length || newItems.length) ? 'auto' : '7.5rem',
        },
    }

    const handleClick = (id: string) => {
        dispatch(openListing(id))
    }

    const renderItems = () => {
        return [...newItems, ...(_newItems || [])].map((item) => (
            <ArticleItemRow key={item.id} item={item} onClick={() => handleClick(item.id)} />
        ))
    }

    useEffect(() => {
        setIsLoading(true)
        dispatch(getNewItems(watcherId)).then(() => {
            setIsLoading(false)
        })
    }, [])

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

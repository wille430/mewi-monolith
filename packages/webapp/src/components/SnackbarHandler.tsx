import { AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { useState } from 'react'
import { nextSnackbar } from 'store/snackbar/creators'
import Snackbar from './Snackbar/Snackbar'

const SnackbarHandler = () => {
    const { current } = useAppSelector((state) => state.snackbar)
    const [_current, _setCurrent] = useState<typeof current>()

    const dispatch = useAppDispatch()

    const handleExited = () => {
        dispatch(nextSnackbar())
    }

    return (
        <div className='fixed bottom-4 left-4 max-h-screen w-full pointer-events-none'>
            <AnimatePresence exitBeforeEnter>
                {current && <Snackbar key={current.id} {...current} handleClose={handleExited} />}
            </AnimatePresence>
        </div>
    )
}

export default SnackbarHandler

import _ from 'lodash'
import { uniqueId } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import Snackbar, { SnackbarProps } from './Snackbar/Snackbar'

type SnackbarContent = SnackbarProps & { id: string }

const RenderSnackbar = (props: SnackbarProps) => {
    return <Snackbar {...props} handleClose={props.handleClose} />
}

interface SnackbarHandlerProps {
    message: string
    type: 'error' | 'info'
}

const SnackbarHandler = ({ message, type }: SnackbarHandlerProps) => {
    const [{ current, queue }, setState] = useState<{
        current: SnackbarContent | null
        queue: SnackbarContent[]
    }>({
        current: null,
        queue: [],
    })

    const stateRef = useRef({
        current,
        queue,
    })

    useEffect(() => {
        if (!message) return

        createSnackbar({
            title: message,
        })
    }, [message])

    useEffect(() => {
        stateRef.current = { current, queue }
    }, [current, queue])

    const createSnackbar = (props: SnackbarProps) => {
        const id = uniqueId('snackbar')
        const content: SnackbarContent = _.assign(props, { id: id, open: true })

        if (current) {
            setState({
                current: current,
                queue: stateRef.current.queue.concat(content),
            })
        } else {
            setState({
                queue,
                current: content,
            })
        }
    }

    function handleClose() {
        setState({
            queue: stateRef.current.queue,
            current: _.assign(stateRef.current.current, { open: false }),
        })
    }

    function openNext() {
        const newCurrent = stateRef.current.queue[0]
        const newQueue = stateRef.current.queue.splice(1)

        console.log({
            newQueue,
            newCurrent,
        })

        if (stateRef.current.queue.length) {
            setState({
                current: newCurrent,
                queue: newQueue,
            })
        } else {
            setState({ current: null, queue: [] })
        }
    }

    return (
        <div className='fixed bottom-4 left-4 max-h-screen'>
            {current && (
                <RenderSnackbar
                    key={current?.id}
                    {...current}
                    handleClose={handleClose}
                    onExited={openNext}
                    type={type}
                />
            )}
        </div>
    )
}

export default SnackbarHandler

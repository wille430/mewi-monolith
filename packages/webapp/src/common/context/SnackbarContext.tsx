import Snackbar, { SnackbarProps } from 'common/components/Snackbar'
import _, { uniqueId } from 'lodash'
import { createContext, ReactNode, useEffect, useRef, useState } from 'react'
import { v4 } from 'uuid'

type SnackbarContent = SnackbarProps & { id: string }

interface SnackbarContextProps {
    setSnackbar: (val: SnackbarProps) => void
}

export const SnackbarContext = createContext<SnackbarContextProps>({
    setSnackbar: () => undefined,
})

interface SnackbarProviderProps {
    children: ReactNode
}

const RenderSnackbar = (props: SnackbarProps) => {
    return <Snackbar {...props} handleClose={props.handleClose} />
}

const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
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
            newCurrent
        })

        if (stateRef.current.queue.length) {
            setState({
                current: newCurrent,
                queue: newQueue
            })
        } else {
            setState({ current: null, queue: [] })
        }
    }

    return (
        <SnackbarContext.Provider
            value={{
                setSnackbar: createSnackbar,
            }}
        >
            {children}
            <div
                className='fixed max-h-screen bottom-4 left-4'
            >
                {current && (
                    <RenderSnackbar
                        key={current?.id}
                        {...current}
                        handleClose={handleClose}
                        onExited={openNext}
                    />
                )}
            </div>
        </SnackbarContext.Provider>
    )
}

export default SnackbarProvider

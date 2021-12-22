import Snackbar, { SnackbarProps } from 'common/components/Snackbar'
import { createContext, ReactNode, useState } from 'react'
import { v4 } from 'uuid'

interface SnackbarContextProps {
    setSnackbar: (val: SnackbarProps) => void
}

export const SnackbarContext = createContext<SnackbarContextProps>({
    setSnackbar: () => {},
})

interface SnackbarProviderProps {
    children: ReactNode
}

const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    const [snackbars, setSnackbars] = useState<{ [key: string]: SnackbarProps }>({})

    const updateSnackbar = (newVal: SnackbarProps) => {
        const id = v4()
        setSnackbars({
            ...snackbars,
            [id]: {
                ...newVal,
                open: true,
                onClose: () => handleClose(id),
                onDelete: () => handleDelete(id),
            },
        })
    }

    const handleDelete = (id: string) => {
        const newSnackbars = snackbars
        delete newSnackbars[id]
        setSnackbars(newSnackbars)
    }

    const handleClose = async (id: string) => {
        setSnackbars((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                open: false,
            },
        }))
    }

    return (
        <SnackbarContext.Provider
            value={{
                setSnackbar: updateSnackbar,
            }}
        >
            {children}
            <div className='fixed max-h-screen bottom-4 left-4'>
                <div className='flex flex-col gap-2'>
                    {Object.keys(snackbars).map((key) => (
                        <Snackbar key={key} {...snackbars[key]} />
                    ))}
                </div>
            </div>
        </SnackbarContext.Provider>
    )
}

export default SnackbarProvider

import { createContext, ProviderProps, ReactElement } from 'react'
import useItem from './useItem'

export const SelectedItemContext = createContext<any | null>(null)

interface Props {
    children: ProviderProps<ReactElement>
}

export const SelectedItemProvider = ({ children }: Props) => {

    const { item, setItem } = useItem()

    return (
        <SelectedItemContext.Provider value={{ item, setItem }}>
            {children}
        </SelectedItemContext.Provider>
    )
}
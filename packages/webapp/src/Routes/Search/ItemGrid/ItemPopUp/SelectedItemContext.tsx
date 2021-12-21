import { createContext, ProviderProps, ReactElement, ReactNode } from 'react'
import useItem from './useItem'

export const SelectedItemContext = createContext<any | null>(null)

interface SelectedItemProviderProps {
    children: ReactNode
}

export const SelectedItemProvider = ({ children }: SelectedItemProviderProps) => {

    const { item, setItem } = useItem()

    return (
        <SelectedItemContext.Provider value={{ item, setItem }}>
            {children}
        </SelectedItemContext.Provider>
    )
}
import { PublicWatcher } from "@mewi/types";
import { deleteWatcher } from "api";
import { SnackbarContext } from "common/context/SnackbarContext";
import { createContext, ReactNode, useContext, useReducer } from "react";

interface WatcherContextProps {
    watchers: PublicWatcher[],
    dispatch: Function
}

interface ProviderProps {
    children: ReactNode
}

export const WatcherContext = createContext<WatcherContextProps>({
    watchers: [],
    dispatch: () => { }
})

type Action =
    | { type: 'remove', id: string }
    | { type: 'add', newWatcher: PublicWatcher }
    | { type: 'replaceAll', newWatchers: PublicWatcher[] }

const reducer = (watchers: PublicWatcher[], action: Action): PublicWatcher[] => {
    switch (action.type) {
        case 'remove':
            return watchers.filter(watcher => watcher._id.toString() !== action.id)
        case 'add':
            return watchers.concat(action.newWatcher)
        case 'replaceAll':
            action.newWatchers = action.newWatchers.filter(watcher => Boolean(watcher))
            return action.newWatchers
        default:
            return watchers
    }
}

const initialState: PublicWatcher[] = []

export const WatcherProvider = ({ children }: ProviderProps) => {
    const [watchers, dispatch] = useReducer(reducer, initialState)
    const { setSnackbar } = useContext(SnackbarContext)

    const asyncDispatch = async (action: Action) => {
        switch (action.type) {
            case 'remove':
                await deleteWatcher(action.id).then(() => {
                    dispatch({ type: 'remove', id: action.id })
                    setSnackbar({
                        title: 'Bevakningen togs bort!'
                    })
                })
                break
            case 'add':
                dispatch({ type: 'add', newWatcher: action.newWatcher })
                break
            case 'replaceAll':
                dispatch({ type: 'replaceAll', newWatchers: action.newWatchers })
                break
            default:
                break
        }
    }

    return (
        <WatcherContext.Provider value={{ watchers, dispatch: asyncDispatch }}>
            {children}
        </WatcherContext.Provider>
    )
}
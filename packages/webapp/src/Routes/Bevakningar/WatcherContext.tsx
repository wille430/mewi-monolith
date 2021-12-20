import { deleteWatcher } from "api";
import { SnackbarContext } from "common/context/SnackbarContext";
import { createContext, ReactNode, useContext, useReducer } from "react";

interface WatcherState {
    id: string,
    [key: string]: any
}

interface WatcherContextProps {
    watchers: WatcherState[],
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
    | { type: 'add', newWatcher: WatcherState }
    | { type: 'replaceAll', newWatchers: WatcherState[] }

const reducer = (watchers: WatcherState[], action: Action): WatcherState[] => {
    switch (action.type) {
        case 'remove':
            return watchers.filter((x: WatcherState) => x._id !== action.id)
        case 'add':
            return watchers.concat(action.newWatcher)
        case 'replaceAll':
            action.newWatchers = action.newWatchers.filter(watcher => Boolean(watcher))
            return action.newWatchers
        default:
            return watchers
    }
}

const initialState: WatcherState[] = []

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
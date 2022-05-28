import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import { configureStore } from '@reduxjs/toolkit'
import { AnyAction, Store as ReduxStore } from 'redux'
import { rootReducer } from './reducer'

const reducer = (state: ReturnType<typeof rootReducer>, action: AnyAction) => {
    if (action.type === HYDRATE) {
        const nextState: ReturnType<typeof rootReducer> = {
            ...state, // use previous state
            ...action.payload, // apply delta from hydration
        }
        return nextState
    } else {
        return rootReducer(state, action)
    }
}

export const makeStore = () =>
    configureStore({
        // @ts-ignore
        reducer,
        // @ts-ignore
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    })

export type Store = ReturnType<typeof makeStore>
export type RootState = ReturnType<Store['getState']>
export type AppDispatch = Store['dispatch']

export type ResourceType = {
    isLoading: boolean
    error: boolean
}

export const wrapper = createWrapper<ReduxStore<RootState>>(makeStore, {
    debug: process.env.NODE_ENV !== 'production',
})

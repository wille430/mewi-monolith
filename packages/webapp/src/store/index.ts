import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import { rootReducer } from './reducer'
import { configureStore } from '@reduxjs/toolkit'
import { AnyAction, Store as ReduxStore } from 'redux'

const reducer = (state: ReturnType<typeof rootReducer>, action: AnyAction) => {
    if (action.type === HYDRATE) {
        const nextState = {
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
        reducer,
    })
export type Store = ReturnType<typeof makeStore>
export type RootState = ReturnType<Store['getState']>
export type AppDispatch = Store['dispatch']

export const wrapper = createWrapper<ReduxStore<RootState>>(makeStore, {
    debug: process.env.NODE_ENV !== 'production',
})

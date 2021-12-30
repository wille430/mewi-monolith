import { applyMiddleware } from 'redux'
import { rootReducer } from './reducer'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { configureStore } from '@reduxjs/toolkit'

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    enhancers: [composedEnhancer],
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

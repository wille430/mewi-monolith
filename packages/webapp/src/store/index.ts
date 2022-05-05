import { applyMiddleware } from 'redux'
import { rootReducer } from './reducer'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { configureStore } from '@reduxjs/toolkit'
import { createEpicMiddleware } from 'redux-observable'
import { rootEpic } from './epic'

const epicMiddleware = createEpicMiddleware()
const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware, epicMiddleware))

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    enhancers: [composedEnhancer],
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export type StatusType = 'pending' | 'fulfilled' | 'error'

epicMiddleware.run(rootEpic)

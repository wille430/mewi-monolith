import { userReducer } from './user'
import { combineReducers } from 'redux'

export const rootReducer = combineReducers({
    user: userReducer,
})

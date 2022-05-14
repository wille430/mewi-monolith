import { userReducer } from './user'
import { combineReducers } from 'redux'
import { listingsReducer } from './listings'

export const rootReducer = combineReducers({
    user: userReducer,
    listings: listingsReducer,
})

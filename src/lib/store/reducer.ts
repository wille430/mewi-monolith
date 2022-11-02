import { combineReducers } from 'redux'
import { userReducer } from './user'
import { listingsReducer } from './listings'

export const rootReducer = combineReducers({
    user: userReducer,
    listings: listingsReducer,
})

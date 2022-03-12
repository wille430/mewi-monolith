import authReducer from './auth/slice'
import watchersReducer from './watchers/slice'
import searchReducer from './search/slice'
import userReducer from './user/slice'
import snackbarReducer from './snackbar/slice'
import { combineReducers } from 'redux'
import itemDisplayReducer from './itemDisplay/slice'

export const rootReducer = combineReducers({
    auth: authReducer,
    watchers: watchersReducer,
    search: searchReducer,
    itemDisplay: itemDisplayReducer,
    user: userReducer,
    snackbar: snackbarReducer,
})

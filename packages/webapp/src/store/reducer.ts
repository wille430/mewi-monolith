import authReducer from './auth/slice'
import watchersReducer from './watchers/slice'
import searchReducer from './search/slice'
import userReducer from './user/slice'
import snackbarReducer from './snackbar/slice'
import { combineReducers } from 'redux'

export const rootReducer = combineReducers({
    auth: authReducer,
    watchers: watchersReducer,
    search: searchReducer,
    user: userReducer,
    snackbar: snackbarReducer,
})

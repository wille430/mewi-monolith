import { combineEpics } from 'redux-observable'
import searchEpics from './search/epic'

export const rootEpic = combineEpics(...searchEpics)

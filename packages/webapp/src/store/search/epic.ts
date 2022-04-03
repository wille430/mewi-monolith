import _ from 'lodash'
import { Action } from 'redux'
import { distinctUntilChanged, map, Observable, tap } from 'rxjs'
import { RootState } from 'store'
import { updateSearchParams } from './creators'

const filtersEpic = (action$: Observable<Action<any>>, state$: Observable<RootState>) => {
    return state$.pipe(
        map((state) => state.search.filters),
        distinctUntilChanged((prev, current) => _.isEqual(prev, current)),
        tap((value) => console.log(value)),
        map(() => updateSearchParams())
    )
}

export default [filtersEpic]

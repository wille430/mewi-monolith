import type { TypedUseSelectorHook} from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '@/lib/store'

export const useAppDispatch = useDispatch<AppDispatch | any>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

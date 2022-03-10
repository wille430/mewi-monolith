import { createSlice } from '@reduxjs/toolkit'
import { forgottenPassword, getInfo, updateUserInfo } from './creator'
import { UserState } from './types'

const initialState: UserState = {}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(updateUserInfo.fulfilled, (state, action) => {
            state[action.payload.field] = action.payload.new_val
        })

        builder.addCase(getInfo.fulfilled, (state, action) => {
            console.log(JSON.stringify(action.payload))
            state.email = action.payload.email
        })
    },
})

export default userSlice.reducer

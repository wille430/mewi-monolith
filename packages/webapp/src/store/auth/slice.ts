import { createSlice } from '@reduxjs/toolkit'
import { isFulfilled, isPending } from '@reduxjs/toolkit'
import { createUser, loginUser, logOut, onAuthLoad, refreshAccessToken } from './creators'
import { AuthState } from './types'

const initialState: AuthState = {
    isLoggedIn: false,
    isLoading: false,
    error: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder.addCase(loginUser.fulfilled, (state, action) => {
            const { jwt, refreshToken } = action.payload

            if (jwt && refreshToken) {
                localStorage.setItem('jwt', jwt)
                localStorage.setItem('refreshToken', refreshToken)

                state.isLoggedIn = true
            }
        })

        builder.addCase(onAuthLoad, (state, action) => {
            const { jwt, refreshToken } = action.payload
            if (jwt && refreshToken) {
                state.isLoggedIn = true
            }
        })

        builder.addCase(logOut, (state, action) => {
            state.isLoggedIn = false

            localStorage.removeItem('jwt')
            localStorage.removeItem('refreshToken')
        })

        builder.addCase(createUser.fulfilled, (state, action) => {
            const { jwt, refreshToken } = action.payload
            if (!jwt || !refreshToken) return

            state.isLoggedIn = true

            localStorage.setItem('jwt', jwt)
            localStorage.setItem('refreshToken', refreshToken)
        })

        builder
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                if (!action.payload) return
                const { jwt, refreshToken } = action.payload

                state.isLoggedIn = true

                localStorage.setItem('jwt', jwt)
                localStorage.setItem('refreshToken', refreshToken)
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                state.isLoggedIn = false

                localStorage.removeItem('jwt')
                localStorage.removeItem('refreshToken')
            })

        
        builder.addMatcher(isPending, (state, action) => {
            state.isLoading = true
        })


        builder.addMatcher(isFulfilled, (state, action) => {
            state.isLoading = false
        })
    },
})

export default userSlice.reducer

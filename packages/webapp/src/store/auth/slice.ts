import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isFulfilled, isPending } from '@reduxjs/toolkit'
import { createUser, loadPage, loginUser, logOut, onAuthLoad, refreshAccessToken } from './creators'
import { AuthState } from './types'

const initialState: AuthState = {
    isLoggedIn: false,
    isLoading: false,
    errors: {
        email: '',
        password: '',
        repassword: '',
        all: '',
    },
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                const { jwt, refreshToken } = action.payload

                if (jwt && refreshToken) {
                    localStorage.setItem('jwt', jwt)
                    localStorage.setItem('refreshToken', refreshToken)

                    state.isLoggedIn = true
                }
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
                state.errors = action.payload
            })

        builder.addCase(onAuthLoad, (state, action) => {
            const { jwt, refreshToken } = action.payload
            if (jwt || (jwt && refreshToken)) {
                state.isLoggedIn = true
            }
        })

        builder.addCase(logOut, (state, action) => {
            state.isLoggedIn = false

            localStorage.removeItem('jwt')
            localStorage.removeItem('refreshToken')
        })

        builder
            .addCase(createUser.fulfilled, (state, action) => {
                const { jwt, refreshToken } = action.payload
                if (!jwt || !refreshToken) return

                state.isLoggedIn = true

                localStorage.setItem('jwt', jwt)
                localStorage.setItem('refreshToken', refreshToken)
            })
            .addCase(createUser.rejected, (state, action: PayloadAction<any>) => {
                state.errors = action.payload
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
                console.log('LOGGIN OUT...')
                state.isLoggedIn = false

                localStorage.removeItem('jwt')
                localStorage.removeItem('refreshToken')
            })

        builder.addCase(loadPage, (state, action) => {
            state.errors = initialState.errors
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

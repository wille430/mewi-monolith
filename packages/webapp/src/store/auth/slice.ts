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
                const { access_token, refresh_token } = action.payload

                if (access_token && refresh_token) {
                    localStorage.setItem('access_token', access_token)
                    localStorage.setItem('refresh_token', refresh_token)

                    state.isLoggedIn = true
                }
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
                state.errors = action.payload
            })

        builder.addCase(onAuthLoad, (state, action) => {
            const { access_token, refresh_token } = action.payload
            if (access_token || (access_token && refresh_token)) {
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
                const { access_token, refresh_token } = action.payload
                if (!access_token || !refresh_token) return

                state.isLoggedIn = true

                localStorage.setItem('access_token', access_token)
                localStorage.setItem('refresh_token', refresh_token)
            })
            .addCase(createUser.rejected, (state, action: PayloadAction<any>) => {
                state.errors = action.payload
            })

        builder
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                if (!action.payload) return
                const { access_token, refresh_token } = action.payload

                state.isLoggedIn = true

                localStorage.setItem('access_token', access_token)
                localStorage.setItem('refresh_token', refresh_token)
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

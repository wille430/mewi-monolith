import { Error, Types } from '@mewi/common'
import { createAsyncThunk } from '@reduxjs/toolkit'
import userApi from 'api/userApi'
import { RootState } from 'store'
import { UserActionType } from './types'

// TODO: Complete functions
export const updateUserInfo = createAsyncThunk(
    UserActionType.UPDATE_INFO,
    (
        {
            field,
            new_val,
        }: { field: Types.EditableUserFields; new_val?: Types.UserData[Types.EditableUserFields] },
        thunkApi
    ) => {
        const state = thunkApi.getState() as RootState
        const userState = state.user

        // skip if value is the same already
        if (userState[field] === new_val) {
            return { field, new_val }
        }

        // show confirmation modal
        let modalMessage = 'Är du säker att du vill göra ändringarna?'
        if (field === 'email') {
            modalMessage = `Är du säker att du vill ändra din e-postaddress till kontot från ${userState.email} till ${new_val}?`
        }

        // eslint-disable-next-line no-restricted-globals
        if (!confirm(modalMessage)) {
            return { field, new_val: userState[field] }
        }

        try {
            userApi.updateUserInfo(field, new_val || '')

            return {
                field,
                new_val,
            }
        } catch (e) {
            return thunkApi.rejectWithValue(e)
        }
    }
)

export const getInfo = createAsyncThunk(UserActionType.FETCH_USER_INFO, async () => {
    const info = await userApi.getInfo()

    return info
})

export const forgottenPassword = createAsyncThunk(
    UserActionType.FORGOTTEN_PASSWORD,
    async (email: string, thunkApi) => {
        try {
            await userApi.forgottenPassword(email)
            return
        } catch (e: any) {
            if (e.error) {
                const error = e.error
                console.log(error.type)
                switch (error.type) {
                    case Error.Auth.INVALID_EMAIL:
                        return thunkApi.rejectWithValue('Epostaddressen som angavs är inkorrekt')
                    case Error.Auth.MISSING_USER:
                        return thunkApi.fulfillWithValue(undefined)
                    default:
                        return thunkApi.rejectWithValue('Ett fel inträffade')
                }
            } else {
                return thunkApi.rejectWithValue('Ett fel inträffade')
            }
        }
    }
)

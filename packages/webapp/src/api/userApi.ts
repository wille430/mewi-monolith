import { EditableUserFields, UserData } from '@wille430/common'
import axios from 'axios'

const updateUserInfo = async (field: EditableUserFields, value: UserData[EditableUserFields]) =>
    await axios.put('/user', {
        field,
        value,
    })

const getInfo = async () => {
    const response = await axios.get('/user')

    return response.data
}

const forgottenPassword = async (email: string): Promise<void> => {
    await axios.post('/auth/password/reset', { email })
}

export default {
    updateUserInfo,
    getInfo,
    forgottenPassword,
}

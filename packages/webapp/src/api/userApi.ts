import { EditableUserFields, UserData } from '@mewi/types'
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

const forgottenPassword = async (): Promise<void> => {
    await axios.post('/user/password/reset')
}

export default {
    updateUserInfo,
    getInfo,
    forgottenPassword,
}

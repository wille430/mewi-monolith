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

export default {
    updateUserInfo,
    getInfo
}

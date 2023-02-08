import { IUser } from '@/common/schemas'
import type { FindAllUserDto } from '@/lib/modules/users/dto/find-all-user.dto'
import { stringify } from 'querystring'
import { client } from '../index'

export const getUsers = (filters: FindAllUserDto) => {
    return client.get<never, IUser[]>(`/users?${stringify({ ...filters })}`)
}

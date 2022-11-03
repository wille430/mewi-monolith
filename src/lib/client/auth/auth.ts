import type SignUpDto from '@/lib/modules/auth/dto/sign-up.dto'
import { client } from '..'

export const signup = (data: SignUpDto) => client.post('/auth/signup', data)

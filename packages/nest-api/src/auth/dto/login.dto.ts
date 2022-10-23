import { PickType } from '@nestjs/mapped-types'
import SignUpDto from './sign-up.dto'

export class LoginDto extends PickType(SignUpDto, ['email', 'password']) {}

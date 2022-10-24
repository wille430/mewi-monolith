import type { NextApiRequest, NextApiResponse } from 'next'
import { container } from 'tsyringe'
import { validate } from 'class-validator'
import { AuthService } from '@/backend/modules/auth/auth.service'
import SignUpDto from '@/backend/modules/auth/dto/sign-up.dto'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const authService = container.resolve(AuthService)

    const dto = new SignUpDto()
    dto.email = req.body.email
    dto.password = req.body.password
    dto.passwordConfirm = req.body.passwordConfirm

    const errors = await validate(dto)

    if (errors.length) {
        return res.status(400).send(errors)
    }

    await authService.signUp(dto)

    res.status(201).send({ message: 'OK' })
}

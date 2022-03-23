import { UserService } from 'services/UserServices'

export const getInfo = async (req, res, next) => {
    const { user_id } = req.user
    const info = await UserService.info(user_id).catch(next)
    res.status(200).send(info)
}

export const updateUserInfo = async (req, res, next) => {
    const { user_id } = req.user
    const { field, value } = req.body

    await UserService.updateInfoField(user_id, field, value).catch(next)

    res.status(204)
}

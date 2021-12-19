import { UserService } from 'services/UserServices'

export const getInfo = async (req, res, next) => {
    const { user_id } = req.user
    const info = await UserService.info(user_id).catch(next)
    res.status(200).send(info)
}
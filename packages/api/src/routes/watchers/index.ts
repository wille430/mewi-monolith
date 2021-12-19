import { Router } from 'express'
import WatcherModel from 'models/WatcherModel'
import Authentication from 'middleware/Authentication'

const router = Router()

router.get('/', Authentication.basicAuthentication, async (req, res) => {
    const allWatchers = await WatcherModel.find({})
    res.send(allWatchers)
})

router.get('/:id', Authentication.authenticateJWT, async (req, res) => {
    const watcher_id = req.params.id
    const watcher = await WatcherModel.findOne({ _id: watcher_id })
    res.send(watcher)
})

export default router
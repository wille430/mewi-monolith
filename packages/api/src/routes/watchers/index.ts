import { Router } from 'express'
import WatcherModel from 'models/WatcherModel'
import { authenticateJWT, basicAuthentication } from 'middleware/Authentication'

const router = Router()

router.get('/', basicAuthentication, async (req, res) => {
    const allWatchers = await WatcherModel.find({})
    res.send(allWatchers)
})

router.get('/:id', authenticateJWT, async (req, res) => {
    const watcher_id = req.params.id
    const watcher = await WatcherModel.findOne({ _id: watcher_id })
    res.send(watcher)
})

export default router

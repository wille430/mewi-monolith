import WatcherService from 'services/WatcherService'
import { UserWatcherService } from 'services/UserServices'
import { APIError, SearchFilterDataProps, ValidationErrorCodes } from '@mewi/types'

export const getAll = async (req, res, next) => {
    // Get user_id

    try {
        const { user_id } = req.user
        const watchers = await UserWatcherService.getAll(user_id)

        res.status(200).json({
            watchers: watchers,
        })
    } catch (e) {
        next(e)
    }
}

export const create = async (req, res, next) => {
    const { user_id } = req.user
    const searchFilters: SearchFilterDataProps | undefined = req.body.searchFilters

    try {
        if (!searchFilters) {
            throw new APIError(
                422,
                ValidationErrorCodes.MISSING_FIELDS,
                'You must provide search filters to create a new watcher.'
            )
        } else {
            // Create watcher
            const newWatcher = await UserWatcherService.addWatcher(user_id, searchFilters)
            res.status(201).json({
                watcher: newWatcher,
            })
        }
    } catch (e) {
        return next(e)
    }
}

export const remove = async (req, res, next) => {
    const { user_id } = req.user
    const { watcher_id } = req.params

    try {
        await new WatcherService(watcher_id).delete(user_id)
        res.sendStatus(200)
    } catch (e) {
        next(e)
        return
    }
}

export const update = async (req, res, next) => {
    // get watcher id
    const { user_id } = req.user
    const { watcher_id } = req.params
    const { searchFilters } = req.body

    try {
        if (!searchFilters) {
            throw new APIError(
                422,
                ValidationErrorCodes.MISSING_FIELDS,
                'You must provide search filters to update a new watcher.'
            )
        } else {
            // Update watcher
            const newWatcher = await UserWatcherService.updateWatcher(
                user_id,
                watcher_id,
                searchFilters
            )
            res.status(201).json({
                watcher: newWatcher,
            })
        }
    } catch (e) {
        next(e)
        return
    }

    try {
        const updatedWatcher = await UserWatcherService.updateWatcher(
            user_id,
            watcher_id,
            searchFilters
        )
        res.status(200).json({
            watcher: updatedWatcher,
        })
    } catch (e) {
        next(e)
        return
    }
}

export const getById = async (req, res, next) => {
    const { watcher_id } = req.params

    try {
        const watcher = await new WatcherService(watcher_id).watcher()
        res.status(200).json({
            watcher: watcher,
        })
    } catch (e) {
        next(e)
        return
    }
}

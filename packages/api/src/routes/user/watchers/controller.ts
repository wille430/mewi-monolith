import WatcherService from 'services/WatcherService'
import { UserWatcherService } from 'services/UserServices'
import SearchService from 'services/SearchService'
import { APIError, ValidationErrorCodes } from 'types/errorCodes'
import { WatcherErrorCodes } from 'types/watcher'

export const getAll = async (req, res, next) => {
    // Get user_id
    const { user_id } = req.user
    const watchers = await UserWatcherService.getAll(user_id).catch(next)

    res.status(200).json({
        watchers: watchers
    })
}

export const create = async (req, res, next) => {
    const { user_id } = req.user
    const { query, metadata } = req.body

    try {
        if (!query || !metadata) {

            let missingVariables: string[] = []

            if (!query) missingVariables.push('query')
            if (!metadata) missingVariables.push('metadata')

            const errorMessage = 'Missing request parameters. Missing: ' + missingVariables.join(', ')

            throw new APIError(422, ValidationErrorCodes.MISSING_FIELDS, errorMessage)
        }

        if (!await SearchService.validateQuery(query)) {
            throw new APIError(421, ValidationErrorCodes.INVALID_INPUT, 'Invalid query.')
        }

        const watcher = await UserWatcherService.addWatcher(user_id, { metadata, query })
        res.status(201).json({
            watcher: watcher
        })
    } catch (e) {
        next(e)
        return
    }
}

export const remove = async (req, res, next) => {
    const { user_id } = req.user
    const { watcher_id } = req.params

    try {
        await new WatcherService(watcher_id).delete(user_id)
        res.sendStatus(200)
    }
    catch (e) {
        next(e)
        return
    }
}

export const update = async (req, res, next) => {
    // get watcher id
    const { user_id } = req.user
    const { watcher_id } = req.params
    const { metadata, query } = req.body
    
    if (!query || !metadata) {
        next(new APIError(422, ValidationErrorCodes.INVALID_INPUT, 'Invalid query or metadata.'))
        return
    }

    if (!await SearchService.validateQuery(query)) {
        next(new APIError(422, WatcherErrorCodes.INVALID_QUERY, 'The query provided is invalid.'))
        return
    }

    try {
        const updatedWatcher = await UserWatcherService.updateWatcher(user_id, watcher_id, { query, metadata })
        res.status(200).json({
            watcher: updatedWatcher
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
            watcher: watcher
        })
    } catch (e) {
        next(e)
        return
    }
}
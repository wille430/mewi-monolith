import { SearchPostRequestBody } from '@mewi/types'
import SearchService from '../../services/SearchService'

export const getAll = async (req, res, next) => {
    const search = await SearchService.search()

    res.status(200).json(search)
}

export const suggest = async (req, res) => {
    const { keyword } = req.params
    const suggestions = await SearchService.autocomplete(keyword)

    res.status(200).json(suggestions)
}

export const findById = async (req, res) => {
    const { item_id } = req.params
    const response = await SearchService.findById(item_id)

    res.status(200).json(response)
}

export const getSearchResults = async (req, res) => {
    try {
        const options: SearchPostRequestBody = req.body
        res.status(200).json({
            options: options,
            ...(await SearchService.search(options.searchFilters, options)),
        })
    } catch (e) {
        console.error(e)
        res.status(500)
    }
}

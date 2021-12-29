import { elasticClient } from '../config/elasticsearch'
const index = 'items'

const SavedItemsController = {
    add: async (req, res) => {
        try {
            let items = req.body

            if (!Array.isArray(items)) {
                console.log('Converting', items, 'to an array')
                items = [items]
            }

            const addedItems = []

            // Add items 1 at a time
            items.forEach(async (item) => {
                try {
                    await elasticClient.index({
                        index: index,
                        body: item,
                    })
                    addedItems.push(item)
                } catch (e) {
                    console.log(e)
                }
            })

            // Force update index
            await elasticClient.indices.refresh({ index: index })

            res.status(200).json({
                status: 200,
                message: 'Successfully added items to database!',
                items: addedItems,
            })
        } catch (e) {
            res.json({
                status: 400,
                message: e,
            })
        }
    },
    getById: async (req, res) => {
        const id = req.params.id

        try {
            const response = await elasticClient.get({
                id: id,
                index: index,
            })

            res.json(response)
        } catch (e) {
            try {
                const statusCode = e.meta.statusCode
                res.status(statusCode).send()
            } catch (e) {
                res.send()
            }
        }
    },
}

export default SavedItemsController

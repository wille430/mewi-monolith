const { MongoClient } = require('mongodb')
const fs = require('fs')

const url = 'mongodb://root:password@mongodb-service:27017'
const client = new MongoClient(url)
const dbName = 'options'

// Save db cats in json file
//
// (async () => {
//     await client.connect()
//     const db = client.db(dbName)
//     const collection = db.collection('categories')
//     const cats = await collection.find({}).toArray().then(array => JSON.stringify(array))

//     fs.writeFile("./categories.json", cats, 'utf-8', (err) => {
//         if (err) console.log(err)
//     })

//     console.log("Complete")
// })()

;(() => {
    fs.readFile('./categories.json', 'utf-8', (err, data) => {
        if (err) throw err
        data = JSON.parse(data)
        data = data.map((cat) => addKey(cat, 'value', toSnakeCase(cat.cat)))
        fs.writeFile('./new_categories.json', JSON.stringify(data), 'utf-8', (err) => {
            if (err) console.log(err)
        })
    })
})()

const addKey = (object, key, value) => {
    object = {
        ...object,
        value: value,
        subcat: object.subcat.map((x) => addKey(x, key, toSnakeCase(x.cat))),
    }
    return object
}

const toSnakeCase = (string) => {
    string = string
        .split('')
        .map((char) => char.toLowerCase())
        .join('')
        .replaceAll(' & ', ' ')
        .replaceAll(',', '')
    return string.replaceAll(' ', '_')
}

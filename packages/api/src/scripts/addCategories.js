const { MongoClient, ObjectId } = require('mongodb')

const url = 'mongodb://root:password@mongodb-service:27017'
const client = new MongoClient(url)
const dbName = 'options'

const categories = {
    // // "Fordon": "temp",
    // "Bilar": "temp",
    // "Bildelar & biltillbehör": "temp",
    // "Båtar": "temp",
    // "Båtdelar & tillbehör": "temp",
    // "Husvagnar & husbilar": "temp",
    // "Mopeder": "temp",
    // "A-traktor": "temp",
    // "Motorcyklar": "temp",
    // "MC-delar": "temp",
    // "Lastbil, truck & entreprenad": "temp",
    // "Skogs- & lantbruksmaskiner": "temp",
    // "Snöskotrar": "temp",
    // "Snöskoterdelar": "temp",
    // // "För hemmet": "temp",
    // "Bygg & trädgård": "temp",
    // "Möbler & hemindredning": "temp",
    // "Husgeråd & vitvaror": "temp",
    // "Verktyg": "temp",
    // // "Bostad": "temp",
    // "Lägenheter": "temp",
    // "Villor": "temp",
    // "Radhus": "temp",
    // "Tomter": "temp",
    // "Gårdar": "temp",
    // "Fritidsboende": "temp",
    // "Utland": "temp",
    // // "Personligt": "temp",
    // "Kläder & skor": "temp",
    // "Accessoarer & klockor": "temp",
    // "Barnkläder & skor": "temp",
    // "Barnartiklar & leksaker": "temp",
    // // "Elektronik": "temp",
    // "Datorer & TV-spel": "temp",
    // "Ljud & bild": "temp",
    // "Telefoner & tillbehör": "temp",
    // // "Fritid & hobby": "temp",
    // "Upplevelser & nöje": "temp",
    // "Böcker & studentlitteratur": "temp",
    // "Cyklar": "temp",
    // "Djur": "temp",
    // "Hobby & samlarprylar": "temp",
    // "Hästar & ridsport": "temp",
    // "Jakt & fiske": "temp",
    // "Musikutrustning": "temp",
    // "Sport- & fritidsutrustning": "temp",
    // // "Affärsverksamhet": "temp",
    // "Affärsöverlåtelser": "temp",
    // "Inventarier & maskiner": "temp",
    // "Lokaler & fastigheter": "temp",
    // "Tjänster": "temp",
    // "Övrigt": "temp",
}

const main = async () => {
    await client.connect()
    const db = client.db(dbName)
    const collection = db.collection('categories')

    for (const key in categories) {
        collection.updateOne(
            { cat: 'Affärsverksamhet' },
            {
                $push: {
                    subcat: { _id: ObjectId(), cat: key, subcat: [] },
                },
            }
        )
    }
    return
}

main()

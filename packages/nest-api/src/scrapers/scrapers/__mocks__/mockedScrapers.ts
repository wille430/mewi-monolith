import Scrapers from '@/scrapers/scrapers'
import path from 'path'
import fs from 'fs'

const resolveScraperFilename = (className: string) => {
    return className.toLowerCase().replace('scraper', '.mock')
}

export const mockedScrapers = Scrapers.map(async (cls) => {
    const filename = resolveScraperFilename(cls.name)
    const relativePath = path.relative(__dirname, path.resolve(__dirname, filename))
    const fullPath = path.resolve(__dirname, relativePath) + '.ts'

    if (fs.existsSync(fullPath)) {
        return import('./' + relativePath).then((val) => val.default) as Promise<typeof cls>
    }

    return cls
})

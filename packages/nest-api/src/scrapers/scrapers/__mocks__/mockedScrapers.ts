import Scrapers from '@/scrapers/scrapers'
import path from 'path'
import fs from 'fs'
import { EntryPoint as EntryPointMock } from '@/scrapers/classes/__mocks__/EntryPoint'
import { PrismaService } from '@/prisma/prisma.service'
import { ListingOrigin } from '@mewi/prisma'

const resolveScraperFilename = (className: string) => {
    return className.toLowerCase().replace('scraper', '.mock')
}

export const mockedScrapers = (prisma: PrismaService) =>
    Scrapers.map(async (cls, index) => {
        const filename = resolveScraperFilename(cls.name)
        const relativePath = path.relative(__dirname, path.resolve(__dirname, filename))
        const fullPath = path.resolve(__dirname, relativePath) + '.ts'

        let provider = cls

        if (fs.existsSync(fullPath)) {
            provider = (await import('./' + relativePath).then((val) => val.default)) as typeof cls
        }

        let entryPoints: EntryPointMock[] = []

        jest.spyOn(provider.prototype, 'createEntryPoint').mockImplementation(
            (...[createConfig, identifier]) => {
                entryPoints.push(
                    new EntryPointMock(
                        prisma,
                        provider.prototype,
                        createConfig,
                        identifier ?? Object.values(ListingOrigin)[index]
                    )
                )
            }
        )
        jest.spyOn(provider.prototype, 'entryPoints', 'get').mockImplementation(
            () => entryPoints as any
        )

        return provider
    })

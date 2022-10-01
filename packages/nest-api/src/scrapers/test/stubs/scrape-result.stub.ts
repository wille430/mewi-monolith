import { ScrapeResult } from "@/scrapers/classes/types/ScrapeResult";

const listings = 

export const scrapeResultStub = (): ScrapeResult => ({
    continue: true,
    listings,
})
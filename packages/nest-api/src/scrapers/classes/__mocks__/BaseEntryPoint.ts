export const BaseEntryPoint = jest.fn().mockReturnValue({
    getMostRecentLog: jest.fn().mockResolvedValue(null),
    createContext: jest.fn().mockResolvedValue(null),
    createScrapeResult: jest.fn().mockResolvedValue(null),
})

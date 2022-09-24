/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@/scrapers/(.*)$": "<rootDir>/src/scrapers/$1"
    },
    transform: {
        "^.+\\.(ts|tsx)$": ['ts-jest', { tsconfig: './tsconfig.spec.json' }]
    },
    testPathIgnorePatterns: [
        '<rootDir>/dist/'
    ]
};
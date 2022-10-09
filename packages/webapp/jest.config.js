const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dit: './'
})

module.exports = createJestConfig({
    testEnvironment: "jest-environment-jsdom",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
        "^.+\\.(ts|tsx)$": ['@swc/jest']
    },
    testPathIgnorePatterns: [
        '<rootDir>/cypress/'
    ],
});
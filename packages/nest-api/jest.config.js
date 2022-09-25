/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    testEnvironment: 'node',
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@/scrapers/(.*)$": "<rootDir>/src/scrapers/$1"
    },
    transform: {
        "^.+\\.(ts|tsx)$": ['@swc/jest', {
            "jsc": {
                "parser": {
                    "syntax": "typescript",
                    "tsx": false,
                    "decorators": true
                },
                "transform": {
                    "legacyDecorator": true,
                    "decoratorMetadata": true
                },
                "target": "es2018"
            },
            "module": {
                "type": "commonjs",
                "noInterop": true
            }
        }]
    },
    testPathIgnorePatterns: [
        '<rootDir>/dist/'
    ],
};
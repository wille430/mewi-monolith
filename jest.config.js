const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './'
})

module.exports = createJestConfig({
    testEnvironment: "node",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
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
        './cypress/'
    ],
    setupFiles: ["<rootDir>/jest.setup.js"],
    globalTeardown: '<rootDir>/script/test-teardown-globals.js',
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"]
});
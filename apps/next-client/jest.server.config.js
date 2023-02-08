const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './'
})

module.exports = createJestConfig({
    displayName: 'server',
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
    setupFiles: ["<rootDir>/jest.server.setup.js"],
    globalTeardown: '<rootDir>/scripts/test-teardown-globals.js',
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    testMatch: [
        "<rootDir>/src/lib/modules/**/*.spec.{ts,tsx}",
        "<rootDir>/src/lib/pipes/**/*.spec.{ts,tsx}",
        "<rootDir>/src/lib/rules/**/*.spec.{ts,tsx}",
        "<rootDir>/src/lib/exceptions/**/*.spec.{ts,tsx}",
        "<rootDir>/src/lib/decorators/**/*.spec.{ts,tsx}",
        "<rootDir>/src/lib/middlewares/**/*.spec.{ts,tsx}",
    ]
});
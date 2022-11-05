const nextJest = require('next/jest')

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
    displayName: 'client',
    setupFilesAfterEnv: ['<rootDir>/jest.client.setup.js'],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testEnvironment: 'jest-environment-jsdom',
    testMatch: [
        "<rootDir>/src/lib/client/**/*.spec.{ts,tsx}",
        "<rootDir>/src/lib/components/**/*.spec.{ts,tsx}",
        "<rootDir>/src/lib/hooks/**/*.spec.{ts,tsx}",
        "<rootDir>/src/lib/store/**/*.spec.{ts,tsx}",
        "<rootDir>/src/lib/utils/**/*.spec.{ts,tsx}",
    ]
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
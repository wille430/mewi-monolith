module.exports = {
    testEnvironment: "node",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
        "^.+\\.(ts|tsx)$": ['@swc/jest']
    },
    testPathIgnorePatterns: [
        '<rootDir>/cypress/'
    ],
};
const jestFilter = require("./jest-filter")

const filteringFunction = (test) => {
    return !test.includes('.integration.spec.ts')
}

module.exports = jestFilter(filteringFunction)
const jestFilter = require("./jest-filter");

module.exports = jestFilter(test => test.includes('.integration.spec.ts'))

module.exports = (filteringFunction) => (testPaths) => {
    const allowedPaths = testPaths
        .filter(filteringFunction)
        .map(test => ({ test }));

    return {
        filtered: allowedPaths,
    };
}
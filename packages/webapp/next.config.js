const { flowRight } = require('lodash')

const withTM = require('next-transpile-modules')(['@mewi/ui'])

const config = {
    sassOptions: {
        includePaths: ['./src'],
        prependData: '@use "styles/_variables.scss" as *;',
    },
}

module.exports = flowRight([withTM])(config)

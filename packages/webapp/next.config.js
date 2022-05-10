const { flowRight } = require('lodash')

const withTM = require('next-transpile-modules')(['@mewi/ui', '@wille430/common'])

const config = {
    sassOptions: {
        includePaths: ['./src'],
        prependData: '@use "styles/_variables.scss" as *;',
    },
}

module.exports = flowRight([withTM])(config)

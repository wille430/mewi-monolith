const flowRight = require('lodash/flowRight')

const funcs = []

if (process.env.NODE_ENV === 'development') {
    funcs.push(require('next-transpile-modules')(['@wille430/ui', '@wille430/common']))

    funcs.push(
        require('@next/bundle-analyzer')({
            enabled: process.env.ANALYZE === 'true',
        })
    )
}

/**
 * @type {import('next').NextConfig}
 **/
const config = {
    redirects: () => [
        {
            source: '/minasidor',
            destination: '/minasidor/bevakningar',
            permanent: true,
        },
    ],

}

module.exports = flowRight(funcs)(config)

const flowRight = require('lodash/flowRight')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const withTM = require('next-transpile-modules')(['@wille430/ui', '@wille430/common', '@mewi/test-utils'])

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

module.exports = flowRight([withBundleAnalyzer, withTM])(config)

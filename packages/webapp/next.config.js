const flowRight = require('lodash/flowRight')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})


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

module.exports = flowRight([withBundleAnalyzer])(config)

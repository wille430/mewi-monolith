const flowRight = require('lodash/flowRight')

const funcs = [
    require('@next/bundle-analyzer')({
        enabled: process.env.ANALYZE === 'true',
    })
]

/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: () => [
        {
            source: '/minasidor',
            destination: '/minasidor/bevakningar',
            permanent: true,
        },
    ],
    experimental: {
        appDir: true
    }
}

module.exports = flowRight(funcs)(nextConfig)

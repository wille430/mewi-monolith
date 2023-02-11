const flowRight = require('lodash/flowRight')

const funcs = [
    require('@next/bundle-analyzer')({
        enabled: process.env.ANALYZE === 'true',
    })
]

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    redirects: () => [
        {
            source: '/minasidor',
            destination: '/minasidor/bevakningar',
            permanent: true,
        },
    ],
}

module.exports = flowRight(funcs)(nextConfig)

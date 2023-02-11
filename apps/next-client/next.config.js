const flowRight = require('lodash/flowRight')
const {join} = require("lodash")

const funcs = [
    require('@next/bundle-analyzer')({
        enabled: process.env.ANALYZE === 'true',
    })
]

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: "standalone",
    experimental: {
        outputFileTracingRoot: join(__dirname, "../../")
    },
    redirects: () => [
        {
            source: '/minasidor',
            destination: '/minasidor/bevakningar',
            permanent: true,
        },
    ],
}

module.exports = flowRight(funcs)(nextConfig)

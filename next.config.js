const flowRight = require('lodash/flowRight')

const funcs = []

if (process.env.NODE_ENV === 'development') {
    funcs.push(
        require('@next/bundle-analyzer')({
            enabled: process.env.ANALYZE === 'true',
        })
    )
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
}

module.exports = flowRight(funcs)(nextConfig)

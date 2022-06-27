const flowRight = require('lodash/flowRight')
const keysTransformer = require('ts-transformer-keys/transformer').default
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const withTM = require('next-transpile-modules')(['@wille430/ui', '@wille430/common'])

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
    webpack: (config, context) => {
        if (!config.module) config.module = {}

        config.module.rules = [
            ...(config.module?.rules ?? []),
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader', // or 'awesome-typescript-loader'
                options: {
                    // make sure not to set `transpileOnly: true` here, otherwise it will not work
                    getCustomTransformers: (program) => ({
                        before: [keysTransformer(program)],
                    }),
                    allowTsInNodeModules: true,
                },
            },
        ]

        return config
    },
}

module.exports = flowRight([withTM, withBundleAnalyzer])(config)

const { flowRight } = require('lodash')
const keysTransformer = require('ts-transformer-keys/transformer').default

const withTM = require('next-transpile-modules')(['@wille430/ui', '@wille430/common'])

/**
 * @type {import('next').NextConfig}
 **/
const config = {
    sassOptions: {
        includePaths: ['./src'],
        prependData: '@use "styles/_variables.scss" as *;',
    },
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

module.exports = flowRight([withTM])(config)

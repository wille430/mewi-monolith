module.exports = {
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.module = {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                    test: /\.(tsx|ts)?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                                '@babel/preset-typescript',
                            ],
                        },
                    },
                },
            ],
        }

        config.resolve = {
            ...config.resolve,
            extensions: ['.tsx', '.ts', '.js'],
        }

        // Important: return the modified config
        return config
    },
}

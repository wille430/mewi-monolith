import path from 'path'
import { startDevServer } from '@cypress/vite-dev-server'
import webpackPreprocessor from '@cypress/webpack-preprocessor'

export default (on, config) => {
    on('dev-server:start', (options) => {
        return startDevServer({
            options,
            viteConfig: {
                configFile: path.resolve(__dirname, '..', '..', 'vite.config.ts'),
            },
        })
    })
    on('file:preprocessor', webpackPreprocessor(options))

    return config
}

import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import typescript from 'rollup-plugin-typescript2'
import keysTransformer from 'ts-transformer-keys/transformer'

// https://vitejs.dev/config/
export default defineConfig({
    test: {
        ...configDefaults,
        globals: true,
        environment: 'jsdom',
    },
    plugins: [
        react({
            exclude: /\.stories\.(t|j)sx?$/,
        }),
        typescript({
            transformers: [
                (service) => ({
                    before: [keysTransformer(service.getProgram()!)],
                    after: [],
                }),
            ],
        }),
    ],
    server: {
        port: 4200,
    },
    optimizeDeps: {
        exclude: ['@mewi/ui'],
    },
    resolve: {
        alias: {
            '@/*': resolve(__dirname, './src'),
            '@/hooks': resolve(__dirname, './src/hooks'),
            '@/utils': resolve(__dirname, './src/utils'),
            '@/lib': resolve(__dirname, './src/lib'),
            '@/store': resolve(__dirname, './src/store'),
        },
    },
    build: {
        outDir: './build',
    },
})

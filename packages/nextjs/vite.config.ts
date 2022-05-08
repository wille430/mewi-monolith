import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

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
    ],
    server: {
        port: 4200,
    },
    optimizeDeps: {
        exclude: ['@mewi/ui'],
    },
    resolve: {
        alias: {
            '@/*': './src/*',
        },
    },
    build: {
        outDir: './build',
    },
})

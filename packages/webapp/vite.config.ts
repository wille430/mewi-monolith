import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

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
            '@/*': resolve(__dirname, './src'),
            '@Backend/*': resolve(__dirname, './src/backend'),
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

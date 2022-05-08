import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        environment: 'jsdom',
        globals: true,
    },
    resolve: {
        alias: {
            'prisma-factory/generated': './node_modules/prisma-factory/generated',
        },
    },
})

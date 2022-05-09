import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
    },
    resolve: {
        alias: {
            'prisma-factory/generated': './node_modules/prisma-factory/generated',
        },
    },
})

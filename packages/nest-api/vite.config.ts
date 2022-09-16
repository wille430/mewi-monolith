import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()],
    resolve: {
        alias: {
            '@mewi/prisma/factory': './node_modules/@mewi/prisma/factory/index.js',
            '@mewi/prisma': './node_modules/@mewi/prisma/index.js',
        },
    },
    test: {
        globals: true,
        deps: {
            inline: ['minifaker'],
        },
    },
})

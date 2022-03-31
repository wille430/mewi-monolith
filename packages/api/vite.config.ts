import { defineConfig, configDefaults } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        exclude: [...configDefaults.exclude, './src/services/**/*'],
        environment: 'node',
        globals: true,
    },
})

import { defineConfig, configDefaults } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import AutoImport from 'unplugin-auto-import'

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        AutoImport({
            imports: ['vitest'],
            dts: true,
        }),
    ],
    test: {
        exclude: [...configDefaults.exclude, './src/services/**/*'],
        environment: 'node',
    },
})

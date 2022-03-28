import { defineConfig, UserConfigExport } from 'vite'
import { readdirSync } from 'fs'
import path from 'path'
import _mainConfig from '@nxext/vite/plugins/vite'
import react from '@vitejs/plugin-react'

const absolutePathAliases: Record<string, string> = {}

const srcPath = path.resolve('packages/webapp/src')
const srcRootContent = readdirSync(srcPath, { withFileTypes: true })

for (const dir of srcRootContent) {
    if (dir.isDirectory || /(.(ts|js|tsx))$/g.test(dir.name)) {
        absolutePathAliases[dir.name.split('.')[0]] = path.join(srcPath, dir.name)
    } else if (/(.(scss|css))$/g.test(dir.name)) {
        absolutePathAliases[dir.name] = path.join(srcPath, dir.name)
    }
}

export default defineConfig({
    plugins: [
        react({
            exclude: /\.stories\.(t|j)sx?$/,
        }),
    ],
    server: {
        port: 4200,
    },
    resolve: {
        alias: {
            ...absolutePathAliases,
            '@root/tailwind.config.js': 'tailwind.config.js',
            '@mewi/types': path.resolve(__dirname, '../types/src/index.ts'),
            '@mewi/util': path.resolve(__dirname, '../util/src/index.ts'),
            '@mewi/ui': path.resolve(__dirname, '../ui/src/index.ts'),
        },
    },
})

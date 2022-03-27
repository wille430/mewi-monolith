import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync } from 'fs'
import path from 'path'

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
    root: 'packages/webapp/src',
    server: {
        port: 4200,
    },
    resolve: {
        alias: {
            ...absolutePathAliases,
            '@root/tailwind.config.js': 'tailwind.config.js',
        },
    },
    optimizeDeps: {
        exclude: ['@mewi/ui'],
        include: ['@mewi/types', '@mewi/util'],
    },
    build: {
        rollupOptions: {
            external: ['@mewi/types'],
        },
    },
})

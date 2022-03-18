import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync } from 'fs'
import path from 'path'

const absolutePathAliases = {}

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
    plugins: [react()],
    root: 'packages/webapp/src',
    server: {
        port: 4200,
    },
    resolve: {
        alias: {
            ...absolutePathAliases,
            '@mewi/types': 'packages/types/src/index.ts',
            '@mewi/ui': 'packages/ui/src/index.ts',
            '@mewi/util': 'packages/util/src/index.ts',
            '@root/tailwind.config.js': 'tailwind.config.js',
        },
    },
    optimizeDeps: {
        include: ['@mewi/types', '@mewi/ui', '@mewi/util', '@root/tailwind.config.js'],
    },
    build: {
        commonjsOptions: {
            include: ['/node_modules/'],
        },
    },
})

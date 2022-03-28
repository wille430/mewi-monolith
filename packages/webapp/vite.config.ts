import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync } from 'fs'
import * as path from 'path'

const absolutePathAliases: Record<string, string> = {}

const srcPath = path.resolve('./src')
const srcRootContent = readdirSync(srcPath, { withFileTypes: true })

for (const dir of srcRootContent) {
    if (dir.isDirectory || /(.(ts|js|jsx|tsx))$/g.test(dir.name)) {
        console.log(path.join(srcPath, dir.name))
        absolutePathAliases[dir.name.split('.')[0]] = path.join(srcPath, dir.name)
    } else if (/(.(scss|css))$/g.test(dir.name)) {
        absolutePathAliases[dir.name] = path.join(srcPath, dir.name)
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 4200,
    },
    resolve: {
        alias: {
            ...absolutePathAliases,
        },
    },
    base: '/',
})

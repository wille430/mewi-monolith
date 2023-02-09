const esbuild = require("esbuild")

const {nodeExternalsPlugin} = require("esbuild-node-externals")

esbuild.build({
    entryPoints: ["./src/main.ts"],
    outfile: "dist/main.js",
    bundle: true,
    minify: true,
    platform: "node",
    sourcemap: true,
    target: "node14",
    plugins: [nodeExternalsPlugin()]
}).catch(() => process.exit(1))

const esbuild = require("esbuild");
const copyStaticFiles = require("esbuild-copy-static-files");
const fs = require("fs");
const path = require("path");

function getJsFiles() {
  let folderPath = "./src";
  let filePaths = [];

  function traverseFolder(currentPath) {
    const files = fs.readdirSync(currentPath);

    files.forEach((file) => {
      const filePath = path.join(currentPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        traverseFolder(filePath); // Recursive call for subdirectories
      } else if (stats.isFile()) {
        const extension = path.extname(filePath);
        if (
          extension === ".js" ||
          extension === ".ts" ||
          extension === ".tsx"
        ) {
          filePaths.push(filePath);
        }
      }
    });
  }

  traverseFolder(folderPath);
  return filePaths;
}

esbuild
  .build({
    entryPoints: getJsFiles(),
    bundle: true,
    platform: "node",
    outdir: "./dist",
    packages: "external",
    plugins: [
      copyStaticFiles({
        src: "./src/emails",
        dest: "./dist/emails",
      }),
    ],
  })
  .catch(() => {
    process.exit(1);
  });

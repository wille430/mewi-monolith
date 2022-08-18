#!/bin/bash
echo "Building api..."
pnpm build -F nest-api
echo "Isolating workspace..."
npx pnpm-isolate-workspace --src-files-enable nest-api

rm -r _isolated_/src
mv _isolated_/workspaces/packages _isolated_/packages
rm -r _isolated_/workspaces
cp ../schemas _isolated_/packages/schemas -r

mkdir ./_isolated_/tools
cp ../../tools/copy_prisma.sh  ./_isolated_/tools/

# Fix pnpm-workspace.yaml

# Delete last 2 lines
# sed -i '$ d' _isolated_/pnpm-workspace.yaml
# sed -i '$ d' _isolated_/pnpm-workspace.yaml

# Clear
truncate -s 0 _isolated_/pnpm-workspace.yaml

# Append updated path
echo "packages:" >> _isolated_/pnpm-workspace.yaml
echo "  - packages/schemas" >> _isolated_/pnpm-workspace.yaml
echo "  - packages/common" >> _isolated_/pnpm-workspace.yaml
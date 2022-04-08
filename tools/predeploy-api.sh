#!/bin/bash
echo "Building api..."
pnpm build -F api
echo "Isolating workspace..."
npx pnpm-isolate-workspace --src-files-enable api
pwd
rm -r _isolated_/src
#!/bin/bash
CLIENT_PATH="./packages/schemas/node_modules/@prisma/client/*"
for dir in ./packages/*; do
    mkdir -p $dir/node_modules/@mewi/prisma/factory
    cp $CLIENT_PATH $dir/node_modules/@mewi/prisma -r
done
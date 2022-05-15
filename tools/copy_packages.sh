#!/bin/bash
PACKAGE_PATH="./node_modules/@mewi/prisma/*"
for dir in ./packages/*; do
    mkdir -p $dir/node_modules/@mewi/prisma
    cp $PACKAGE_PATH $dir/node_modules/@mewi/prisma/ -r
done
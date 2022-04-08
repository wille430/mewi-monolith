#!/bin/bash
pnpm run isolate -F api
scp -o StrictHostKeyChecking=accept-new -r ./packages/api/_isolated_/* root@$API_SERVER_HOST:/root/api
ssh root@$API_SERVER_HOST "cd /root/api; npm i pnpm -g; pnpm i -r; pm2 delete main; pm2 start /root/api/dist/main.js"
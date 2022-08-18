#!/bin/bash

# Remove existing build files
rm -r ./packages/nest-api/dist
rm -r ./packages/nest-api/_isolated_

# Prepare api
pnpm run isolate:api

# Dockerize
docker-compose build || docker compose build
docker tag mewi-monolith-api europe-north1-docker.pkg.dev/mewi-347117/mewi-docker-repo/mewi-api
docker push europe-north1-docker.pkg.dev/mewi-347117/mewi-docker-repo/mewi-api

# Cleanup
rm -r ./packages/nest-api/dist
rm -r ./packages/nest-api/_isolated_
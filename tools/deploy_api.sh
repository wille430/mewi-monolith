#!/bin/bash

# Prepare api
pnpm run isolate -F nest-api

# Dockerize
docker compose build
docker tag mewi-monolith_api europe-north1-docker.pkg.dev/mewi-347117/mewi-docker-repo/mewi-api
docker push europe-north1-docker.pkg.dev/mewi-347117/mewi-docker-repo/mewi-api
#!/bin/bash

# Dockerize
docker-compose up
docker tag mewi-monolith_api registry.heroku.com/mewi-api/web
docker push registry.heroku.com/mewi-api/web
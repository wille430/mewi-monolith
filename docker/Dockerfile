# ./docker/Dockerfile.node
# base node image

# base node image
# https://github.com/prisma/prisma/issues/861#issuecomment-881992292
FROM node:lts-buster-slim AS pnpm

ARG SCOPE
ENV SCOPE=${SCOPE}

ARG FOLDER
ENV FOLDER=${FOLDER}

RUN npm --no-update-notifier --no-fund --global install pnpm

# Deps
FROM pnpm AS builder
WORKDIR /app

COPY . .

# Install everything
RUN pnpm install --no-frozen-lockfile
# Build the package
RUN pnpm -F ./${FOLDER} build

COPY docker/.pnpmfile.cjs .pnpmfile.cjs
RUN pnpm i -F ./${FOLDER} --virtual-store-dir ${FOLDER}/node_modules/.pnpm --prod --no-frozen-lockfile

# Production
FROM pnpm as production
WORKDIR /app
ENV NODE_ENV=production

# Copy from the build artifacts and the locks and package.json, hash.txt.
COPY --from=builder /app/${FOLDER}/dist ./dist
COPY --from=builder /app/${FOLDER}/package.json ./package.json
COPY --from=builder /app/${FOLDER}/node_modules ./node_modules

USER node

CMD ["node", "./dist/main.js"]
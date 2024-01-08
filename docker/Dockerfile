FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --force 
RUN pnpm run --filter=scrape-service build
RUN pnpm run --filter=notification-service build
RUN pnpm deploy --filter=scrape-service --prod /prod/scrape-service
RUN pnpm deploy --filter=notification-service --prod /prod/notification-service

FROM base AS app1
COPY --from=build /prod/scrape-service /prod/scrape-service
WORKDIR /prod/scrape-service
CMD [ "pnpm", "start" ]

FROM base AS app2
COPY --from=build /prod/notification-service /prod/notification-service
WORKDIR /prod/notification-service
CMD [ "pnpm", "start" ]
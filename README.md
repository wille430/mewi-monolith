# Mewi

## Includes

-   Nest API
-   React Webapp
-   Common - shared library
-   UI - component library
-   Schemas - prisma schema

## Deployments

[Webapp](https://mewi.se)
[API](https://api.mewi.se)

## Start development

1. Install dependencies:

```
pnpm install
```

2. Start servers:

```
pnpm run dev -r
```

## Deploy to production

### Deploy Nest API

1. Create image and push to gcloud artifact registry:

```
sudo sh ./tools/deploy_api.sh
```

2. Go to gcloud console and create new revision with the created image.

### Deploy webapp

On each commit to the main branch, Vercel will begin building a production build and deploy it. [Vercel Dashboard](https://vercel.com/dashboard)
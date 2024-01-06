# Mewi

A web application to browse second hand listings from a wide variety of sources such as Blocket, Tradera, Sellpy, and so
on. Build with Next.js and includes three microservices built with TypeScript that listens to messages on a RabbitMQ
instance. The services handle notifications, emails, and scraping of websites.

## Project Screen Shot(s)

### Home page

![Home page](./screenshots/index.png)

### Search page

![Search page](./screenshots/search-iphone.png)

### Create alerts

When new items are added that match your search, you will receive a notification by email.

![Notify me](./screenshots/watchers.png)

## Installation & setup

Clone down this repository. You will need `node`, `docker`, `docker-compose`, and `pnpm` installed globally on your
machine.

Install dependencies:

`pnpm install -F next-client`

To Start Server:

1. Start mongodb docker container by running `./scripts/startReplicateSetEnvironment.sh`. Wait for it to fully finish
   before proceeding. You may have to change permission with `chmod +x ./scripts/startReplicateSetEnvironment.sh` to run
   the script.
2. Run `pnpm run dev -F next-client`

To Start Microservices along with RabbitMQ (optional):

`cd docker && docker-compose up -d`

NOTE: Mongodb docker container must be running before starting containers, otherwise some services will fail.

To Visit App:

`localhost:3000`

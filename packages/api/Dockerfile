FROM node:17.3.0
WORKDIR /app
COPY ../../dist/packages/api .
RUN npm i --production
CMD node ./main.js
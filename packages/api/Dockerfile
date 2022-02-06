FROM node:17.3.0
WORKDIR /app
COPY ./dist/packages/api .
RUN npm i
CMD node ./main.js
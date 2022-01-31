FROM node:17.3.0
WORKDIR /app
RUN npm i --production
RUN npx nx build api
COPY /home/circleci/project/dist/packages/api .
CMD node ./main.js
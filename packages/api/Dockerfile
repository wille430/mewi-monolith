FROM node:16.8
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
CMD ["npm", "start"]
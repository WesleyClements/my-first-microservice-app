FROM node:latest

ENV CI=true

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

CMD ["npm", "start"]
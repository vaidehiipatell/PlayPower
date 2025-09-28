# Node 20
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production || npm install --omit=dev

COPY src ./src
COPY .env ./.env

EXPOSE 8080
CMD ["node", "src/server.js"]

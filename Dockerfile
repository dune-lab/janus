FROM node:24-alpine

WORKDIR /app

COPY janus/package.json ./package.json
COPY janus/package-lock.json ./package-lock.json
RUN npm install

COPY janus/src ./src
COPY janus/tsconfig.json ./tsconfig.json

RUN npx tsc

CMD ["node", "dist/src/server.js"]

FROM node:24-alpine

WORKDIR /app

COPY enxoval/auth/package.json ./enxoval/auth/package.json
COPY enxoval/auth/dist ./enxoval/auth/dist

COPY enxoval/http/package.json ./enxoval/http/package.json
COPY enxoval/http/dist ./enxoval/http/dist

COPY enxoval/types/package.json ./enxoval/types/package.json
COPY enxoval/types/dist ./enxoval/types/dist

WORKDIR /app/janus

COPY janus/package.json janus/package-lock.json ./
RUN npm install

COPY janus/src ./src
COPY janus/tsconfig.json ./

RUN npx tsc

CMD ["node", "dist/src/server.js"]

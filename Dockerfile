FROM node:24-alpine

WORKDIR /app

COPY enxoval/types/package.json ./enxoval/types/package.json
COPY enxoval/observability/package.json ./enxoval/observability/package.json
COPY enxoval/http/package.json ./enxoval/http/package.json
COPY enxoval/auth/package.json ./enxoval/auth/package.json
COPY janus/package.json ./janus/package.json

COPY enxoval/types/dist ./enxoval/types/dist
COPY enxoval/observability/dist ./enxoval/observability/dist
COPY enxoval/http/dist ./enxoval/http/dist
COPY enxoval/auth/dist ./enxoval/auth/dist

RUN printf '{"name":"app","private":true,"workspaces":["enxoval/types","enxoval/observability","enxoval/http","enxoval/auth","janus"]}' > package.json
RUN npm install

WORKDIR /app/janus

COPY janus/src ./src
COPY janus/tsconfig.json ./

RUN /app/node_modules/.bin/tsc

CMD ["node", "dist/src/server.js"]

FROM node:20 AS builder
WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

COPY src ./src
RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app


COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production

CMD ["node", "dist/server.js"]

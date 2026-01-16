# Multi-stage Dockerfile for acquisitions app

FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || true
COPY . .

FROM base AS development
WORKDIR /app
RUN npm install --no-audit --no-fund
ENV NODE_ENV=development
CMD ["node", "--watch", "src/index.js"]

FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/index.js"]

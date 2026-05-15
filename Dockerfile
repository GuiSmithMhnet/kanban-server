# =========================
# BASE
# =========================
FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

# =========================
# DEVELOPMENT
# =========================
FROM base AS development

ENV NODE_ENV=development

RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]

# =========================
# PRODUCTION
# =========================
FROM base AS production

ENV NODE_ENV=production

RUN npm ci --omit=dev

COPY . .

CMD ["npm", "start"]
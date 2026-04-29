FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc* ./
RUN corepack enable \
  && corepack prepare pnpm@10.8.0 --activate \
  && pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable \
  && corepack prepare pnpm@10.8.0 --activate \
  && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

COPY package.json pnpm-lock.yaml .npmrc* ./
RUN corepack enable \
  && corepack prepare pnpm@10.8.0 --activate \
  && pnpm install --prod --frozen-lockfile

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 8080
CMD ["sh", "-c", "pnpm start -p ${PORT:-8080} -H ${HOSTNAME:-0.0.0.0}"]

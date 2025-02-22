FROM node:20-alpine AS base
RUN npm i -g turbo@^2.3.4

FROM base AS builder
RUN apk update
WORKDIR /app
COPY . .
RUN turbo prune http www --docker

FROM base AS installer
RUN apk update
WORKDIR /app

COPY --from=builder /app/out/json/ . 
RUN corepack enable
RUN corepack prepare pnpm@10.0.0 --activate
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/out/full/ .
RUN pnpm exec turbo db:generate
RUN pnpm exec turbo run build

FROM base AS runner
WORKDIR /app

COPY --from=installer /app ./
COPY --from=installer /app/apps/www/dist ./apps/http/public

WORKDIR /app/apps/http/
CMD ["npm", "run", "start"]

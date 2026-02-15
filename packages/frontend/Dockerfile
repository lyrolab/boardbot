FROM node:24.13.1-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
COPY packages/frontend/package*.json ./packages/frontend/
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/frontend/node_modules ./packages/frontend/node_modules
COPY . .
WORKDIR /app/packages/frontend
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html
COPY --from=builder /app/packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4781
CMD ["nginx", "-g", "daemon off;"]

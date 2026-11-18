# syntax=docker/dockerfile:1
# One image runs BOTH the website and the CMS admin (Payload is embedded in Next.js):
#   /        -> public site        /admin -> CMS dashboard
FROM node:22-alpine
RUN apk add --no-cache libc6-compat && corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY . .
RUN pnpm run tinymce:copy
RUN chmod +x docker/entrypoint.sh

ENV NEXT_TELEMETRY_DISABLED=1 PORT=3100 HOSTNAME=0.0.0.0
EXPOSE 3100
# Entrypoint: wait for DB -> run migrations -> build (first start) -> start
ENTRYPOINT ["docker/entrypoint.sh"]

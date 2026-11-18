#!/bin/sh
set -e
export NODE_ENV=production

echo "[aivastra] applying database migrations…"
pnpm migrate

# `next build` renders pages from the DB, so it has to run after migrations (i.e. here, not in the image).
if [ ! -f .next/BUILD_ID ]; then
  echo "[aivastra] building (first start, takes a few minutes)…"
  pnpm build
fi

echo "[aivastra] starting site + admin on :${PORT}"
exec pnpm start

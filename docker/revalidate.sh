#!/bin/sh
# Clear the site's page cache (run after import/seed, which write to the DB from outside the server process).
wget -qO- --header="x-revalidate-secret: $REVALIDATE_SECRET" --header="content-type: application/json" \
  --post-data='{"all":true}' "http://localhost:${PORT:-3100}/api/revalidate" >/dev/null || true

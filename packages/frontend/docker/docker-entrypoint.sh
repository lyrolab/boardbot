#!/bin/sh
set -e

cat <<EOF > /usr/share/nginx/html/config.js
window.__CONFIG__ = { BACKEND_URL: "${BACKEND_URL:-}" };
EOF

exec nginx -g 'daemon off;'

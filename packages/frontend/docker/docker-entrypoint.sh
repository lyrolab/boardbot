#!/bin/sh
set -e

cat <<EOF > /usr/share/nginx/html/config.js
window.__CONFIG__ = {
  VITE_BACKEND_URL: "${VITE_BACKEND_URL:-}",
  VITE_KEYCLOAK_URL: "${VITE_KEYCLOAK_URL:-}",
  VITE_KEYCLOAK_REALM: "${VITE_KEYCLOAK_REALM:-}",
  VITE_KEYCLOAK_CLIENT_ID: "${VITE_KEYCLOAK_CLIENT_ID:-}",
};
EOF

exec nginx -g 'daemon off;'

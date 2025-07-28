#!/bin/sh

# Create the env-config.js file dynamically
echo "Generating runtime environment variables..."

cat <<EOF > /usr/share/nginx/html/env-config.js
window.env = {
  VITE_API_BASE_URL: "$VITE_API_BASE_URL",
  SKIP_PREFLIGHT_CHECK: ,
  REACT_APP_BASE_URL: ,
  REACT_APP_STIMULSOFT_LICENCE_KEY: ,
  REACT_APP_VERSION: ,
  REACT_APP_APP_VERSION: ,
  GENERATE_SOURCEMAP: ,
  REACT_APP_RECAPTCHA_SITE_KEY: ,
  REACT_APP_RECAPTCHA_SECRET_KEY:
}
EOF


echo "Started..."

# Start Nginx
nginx -g 'daemon off;'

#!/bin/bash

# Script to purge Cloudflare cache and update frontend code to force fresh loads
echo "Purging Cloudflare cache and implementing cache-busting..."

# Get current timestamp for cache busting
TIMESTAMP=$(date +%s)

ssh training << EOF
  echo "Connected to server"
  
  # Check which branch is deployed
  cd /var/www/training
  echo "Current branch on server:"
  git branch -v
  
  # Completely stop the service
  echo "Stopping service..."
  pm2 stop training-hub
  
  # Add uniquely versioned cache busting to all resources
  echo "Adding cache-busting version parameter to URL handling code..."
  
  # Update app/page.tsx to add cache busting query param
  sed -i "s/window.location.hash = \`resource=\${id}\`/window.location.hash = \`resource=\${id}?v=${TIMESTAMP}\`/g" app/page.tsx
  
  # Check if change was applied
  echo "Verifying changes to app/page.tsx:"
  grep -A 1 -B 1 "${TIMESTAMP}" app/page.tsx || echo "Cache-busting code not found in app/page.tsx"
  
  # Remove existing build files
  echo "Clearing all caches and build artifacts..."
  rm -rf .next
  npm cache clean --force
  
  # Rebuild everything
  echo "Rebuilding application..."
  npm run build
  
  # Restart service
  echo "Starting service..."
  pm2 start training-hub
  
  echo "Server-side updates completed!"
EOF

# Instructions for Cloudflare cache purge
echo
echo "IMPORTANT: Now you must purge the Cloudflare cache completely!"
echo
echo "1. Log into Cloudflare Dashboard"
echo "2. Select the training.ols.to domain"
echo "3. Go to Caching > Configuration"
echo "4. Click 'Purge Everything'"
echo
echo "Additionally, try these steps:"
echo "- If using a CDN, add a cache-control: no-cache header in development rules"
echo "- After purging cache, open site in a fresh private browsing window"
echo "- Add ?v=${TIMESTAMP} to the URL manually to bypass cache"
echo "- Check Chrome Dev Tools > Network tab to verify resources are not being served from cache" 
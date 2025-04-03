#!/bin/bash

# Script to clear cache and fully rebuild the application
echo "Clearing cache and forcing rebuild on training server..."

ssh training << 'EOF'
  echo "Connected to server"
  
  # Navigate to the project directory
  cd /var/www/training
  
  # Completely remove the .next directory to clear all build caches
  echo "Removing Next.js build cache..."
  rm -rf .next

  # Pull the latest changes again to be sure
  echo "Pulling latest changes..."
  git fetch --all
  git reset --hard origin/fix/next-types
  
  # Clean and reinstall node_modules to ensure clean dependencies
  echo "Cleaning node_modules..."
  rm -rf node_modules
  rm -rf .next
  npm cache clean --force
  
  # Reinstall dependencies
  echo "Reinstalling dependencies..."
  npm install
  
  # Rebuild the application
  echo "Rebuilding the app with clean caches..."
  npm run build
  
  # Restart the service
  echo "Restarting the service..."
  pm2 restart training-hub
  
  echo "Cache clearing and rebuild completed!"
EOF

echo "Script finished. Please do a hard refresh in your browser (Ctrl+Shift+R or Cmd+Shift+R)" 
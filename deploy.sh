#!/bin/bash

# Script to deploy updates to the training server
echo "Deploying to training server..."

ssh training << 'EOF'
  echo "Connected to server"
  
  # Navigate to the project directory (update path if needed)
  cd /var/www/training
  
  # Pull the latest changes
  echo "Pulling latest changes..."
  git pull
  
  # Install any new dependencies
  echo "Installing dependencies..."
  npm install
  
  # Rebuild the application
  echo "Rebuilding the app..."
  npm run build
  
  # Restart the service with the correct name
  echo "Restarting the service..."
  pm2 restart training-hub
  
  echo "Deployment completed!"
EOF

echo "Deployment script finished" 
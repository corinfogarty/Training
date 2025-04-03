#!/bin/bash

echo "Checking service status on training server..."

ssh training << 'EOF'
  echo "Connected to server"
  
  # List running processes
  echo "Checking running processes..."
  ps aux | grep -i "node\|next\|npm" | grep -v grep
  
  # Check if PM2 is running
  echo "Checking PM2 processes if available..."
  which pm2 && pm2 list || echo "PM2 not found"
  
  # Check if systemd service exists
  echo "Checking systemd services if available..."
  systemctl list-unit-files | grep -i "training\|next"
  
  # Check for any running node processes
  echo "Checking all Node.js processes..."
  pgrep -a node
EOF

echo "Service check completed" 
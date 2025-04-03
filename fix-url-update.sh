#!/bin/bash

# Script to fix URL handling issues
echo "Fixing URL update issue in the application..."

ssh training << 'EOF'
  echo "Connected to server"
  
  # Navigate to the project directory
  cd /var/www/training
  
  # Completely stop the service
  echo "Stopping service..."
  pm2 stop training-hub
  
  # Create a backup of the current files
  echo "Creating backups..."
  cp app/page.tsx app/page.tsx.bak
  cp components/ResourceCard.tsx components/ResourceCard.tsx.bak
  
  # Fix 1: Update the URL handling in page.tsx to use pushState instead of hash
  echo "Fixing URL handling in page.tsx..."
  
  # First, ensure the updateUrl function works correctly
  sed -i 's/window.location.hash = `resource=${id}`/window.history.pushState({resourceId: id}, "", `#resource=${id}`)/g' app/page.tsx
  
  # Fix 2: Ensure the hash change event handler works properly
  echo "Updating hash change handler..."
  sed -i '/window.addEventListener.*hashchange/s/.*/    window.addEventListener("hashchange", handleUrlChange);\n    window.addEventListener("popstate", handleUrlChange);/' app/page.tsx
  
  # Fix 3: Add debugging to the handleResourceClick method in CategoryList
  echo "Adding debugging to CategoryList..."
  sed -i '/handleResourceClick/,/onResourceClick/s/onResourceClick(resource.id)/console.log("DEBUG: Calling onResourceClick with", resource.id); onResourceClick(resource.id)/' components/CategoryList.tsx
  
  # Fix 4: Force click handler in ResourceCard to always use onClick callback
  echo "Fixing ResourceCard click handler..."
  sed -i '/handleCardClick/,/return false;/s/if (onClick) {/if (true) { \/\/ Always use onClick callback/' components/ResourceCard.tsx
  
  # Fix 5: Add a console.log to CategoryList render to debug props
  echo "Adding render debugging..."
  sed -i '/return (/i\  console.log("CategoryList rendering with resourceId:", resourceId);' components/CategoryList.tsx
  
  # Rebuild the application
  echo "Rebuilding app..."
  npm run build
  
  # Start the service
  echo "Starting service..."
  pm2 start training-hub
  
  echo "Fix applied! Please check the site now."
EOF

echo
echo "The fix has been applied. Now try these steps:"
echo "1. Open the site in a new private/incognito browser window"
echo "2. Open the browser's developer console (F12)"
echo "3. Try clicking on a resource and look for debug messages"
echo "4. Check if the URL updates to include #resource=ID"
echo
echo "If that doesn't work, try running this in your browser console:"
echo "history.pushState(null, '', '#resource=test123');"
echo "console.log('URL updated to:', window.location.href);" 
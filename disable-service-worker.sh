#!/bin/bash

# Script to check for and disable service workers
echo "Checking for and disabling service workers..."

ssh training << 'EOF'
  echo "Connected to server"
  
  # Navigate to the project directory
  cd /var/www/training
  
  # Check if there are any service worker files
  echo "Checking for service worker files..."
  find . -name "*worker*.js" -o -name "*serviceworker*.js" -o -name "*sw.js*"
  
  # Check if next.config.js has service worker config
  echo "Checking next.config.js for service worker configuration..."
  grep -i "worker\|pwa\|offline" next.config.js || echo "No service worker config found in next.config.js"
  
  # Create a script to unregister service workers
  echo "Creating service worker unregistration script..."
  
  mkdir -p public
  
  cat > public/unregister-sw.js << 'UNREGISTER'
// Script to unregister service workers
if ('serviceWorker' in navigator) {
  console.log('Checking for active service workers...');
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    if (registrations.length > 0) {
      console.log('Found service workers. Unregistering...');
      for (let registration of registrations) {
        registration.unregister();
        console.log('Service worker unregistered:', registration);
      }
      // Force reload without cache
      window.location.reload(true);
    } else {
      console.log('No service workers found.');
    }
  });
}
UNREGISTER

  # Add script to check for service workers on index page
  echo "Modifying app/page.tsx to include service worker deregistration..."
  
  # Check if useEffect is already in page.tsx
  if grep -q "useEffect" app/page.tsx; then
    echo "Found useEffect in page.tsx, will add service worker deregistration code"
    RANDOM_MARKER="service_worker_check_$(date +%s)"
    sed -i "/useEffect.*\[]/a\\
  // ${RANDOM_MARKER}\\
  useEffect(() => {\\
    if (typeof window !== 'undefined') {\\
      // Load service worker unregistration script\\
      const script = document.createElement('script');\\
      script.src = '/unregister-sw.js?v=$(date +%s)';\\
      script.async = true;\\
      document.head.appendChild(script);\\
      console.log('Added service worker cleanup script');\\
    }\\
  }, []);" app/page.tsx
  
    echo "Verifying changes to app/page.tsx:"
    grep -A 5 "${RANDOM_MARKER}" app/page.tsx || echo "Service worker code not found in app/page.tsx"
  else
    echo "Could not find appropriate place to insert service worker code in app/page.tsx"
  fi
  
  # Rebuild the app
  echo "Rebuilding app..."
  npm run build
  
  # Restart the service
  echo "Restarting service..."
  pm2 restart training-hub
  
  echo "Service worker check and cleanup completed!"
EOF

echo "Script completed! Now please do the following:"
echo "1. Purge Cloudflare cache completely"
echo "2. In Chrome DevTools, go to Application > Service Workers and check for active service workers"
echo "3. If you see any, click 'Unregister' for each one"
echo "4. Clear browser cache (Chrome: Settings > Privacy and Security > Clear browsing data)"
echo "5. Open site in a fresh incognito/private window" 
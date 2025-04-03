#!/bin/bash

# Script to clear all caches and restart the application
echo "Refreshing server and clearing browser caches..."

ssh training << 'EOF'
  echo "Connected to server"
  
  # Navigate to the project directory
  cd /var/www/training
  
  # Kill and restart the process more aggressively
  echo "Stopping PM2 process..."
  pm2 stop training-hub
  
  # Completely clear cache
  echo "Clearing all caches..."
  rm -rf .next
  npm cache clean --force
  
  # Manually edit the Next.js config to add cache control headers
  echo "Updating next.config.js..."
  
  # Back up the original config
  cp next.config.js next.config.js.bak
  
  # Create a new config with cache headers
  cat > next.config.js << 'NEXTCONFIG'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'img.youtube.com',
      'i.vimeocdn.com', 
      'training.ols.to',
      'localhost',
      'static.skillshare.com',
      'cdn.skillshare.com',
      'www.skillshare.com',
      'www.cgfasttrack.com',
      'cdn.sanity.io',
      'ssl.gstatic.com',
      'download.blender.org',
      'cdn.motiondesign.school',
      'i.ytimg.com',
      'lh3.googleusercontent.com'
    ],
  },
  // Add cache control headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    // Add any webpack customizations here
    return config
  },
  // Remove experimental features that might cause issues
  experimental: {
    optimizePackageImports: ['@auth/prisma-adapter']
  },
  // Ensure we generate source maps in development
  productionBrowserSourceMaps: true,
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
NEXTCONFIG
  
  # Rebuild with cache headers
  echo "Rebuilding app with cache headers..."
  npm run build
  
  # Start the service again
  echo "Starting the service..."
  pm2 start training-hub
  
  echo "Server refresh completed!"
EOF

echo "Script finished. Do a hard refresh in your browser (Ctrl+Shift+R or Cmd+Shift+R)"
echo "If still not working, try clearing your browser's entire cache for the site:"
echo "Chrome/Edge: go to chrome://settings/clearBrowserData"
echo "Firefox: go to about:preferences#privacy and click 'Clear Data'"
echo "Safari: Preferences > Privacy > Manage Website Data" 
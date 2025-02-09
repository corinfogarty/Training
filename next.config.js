/** @type {import('next').NextConfig} */
const nextConfig = {
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
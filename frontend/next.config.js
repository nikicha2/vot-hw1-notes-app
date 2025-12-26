/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    async rewrites() {
      return [
        {
          source: '/api/:path*/',      // requests from browser to /api/...
          destination: 'http://notes-backend:8000/api/:path*/', // forward to backend service
        },
      ]
    },
  }
  
  module.exports = nextConfig
  
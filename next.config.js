/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    secret: 'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'
  },
  publicRuntimeConfig: {
      url: process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/' // development
      : 'https://server.seedsforce.com.br:18601/', // production
      apiUrl: process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/api' // development api
          : 'https://server.seedsforce.com.br:18601/api' // production api
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  presets: ["next/babel"]
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    secret:
      "THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING",
  },
  publicRuntimeConfig: {
    url:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/" // development
        : process.env.COPYMOD == "tmg"
        ? "http://20.94.100.241/"
        : process.env.COPYMOD * 1 == 2
        ? "https://server.seedsforce.com.br:18602/"
        : "https://server.seedsforce.com.br:18601/", // production
    apiUrl:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api" // development api
        : process.env.COPYMOD == "tmg"
        ? "http://20.94.100.241/api"
        : process.env.COPYMOD * 1 == 2
        ? "https://server.seedsforce.com.br:18602/api"
        : "https://server.seedsforce.com.br:18601/api", // production api
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  presets: ["next/babel"],
};

module.exports = nextConfig;

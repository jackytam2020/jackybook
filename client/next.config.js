/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
  env: {
    HOST: 'http://localhost:8080',
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
  env: {
    HOST: 'https://jackybook-api.onrender.com',
  },
};

module.exports = nextConfig;
// HOST: 'https://jackybook-api.onrender.com',

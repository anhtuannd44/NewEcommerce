/** @type {import('next').NextConfig} */
const path = require('path')

module.exports = {
  env: {
    API_ROOT: process.env.API_ROOT,
    API_IDENTITY: process.env.API_IDENTITY,
    PUBLIC_DOMAIN: process.env.PUBLIC_DOMAIN,
    PREFIX_ROOT_ADMIN_API: process.env.PREFIX_ROOT_ADMIN_API
  },
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: 'loose'
    //jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}

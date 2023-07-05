const { withStoreConfig } = require("./store-config")
const store = require("./store.config.json")

module.exports = withStoreConfig({
  serverRuntimeConfig: {
    // Will only be available on the server side
    apiUrl: 'http://backend:9000'
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: 'http://localhost:9000'
  },
  features: store.features,
  reactStrictMode: true,
  images: {
    domains: ["medusa-public-images.s3.eu-west-1.amazonaws.com", "localhost", "backend", "minio"],
  },
})

console.log("next.config.js", JSON.stringify(module.exports, null, 2))

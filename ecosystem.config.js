const path = require("path")

module.exports = {
  apps: [
    {
      name: "catalog-service",
      script: "npm",
      args: "start",
      cwd: path.resolve(__dirname, `./microservices/catalog-service`),
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "producation",
      },
    },
    {
      name: "auth-service",
      script: "npm",
      args: "start",
      cwd: path.resolve(__dirname, `./microservices/auth-service`),
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
}

import { config } from 'dotenv'
import pkg from "../package.json";
config()

const Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.CATTALOG_PORT|| 4001,
  mongoDB: {
    url: process.env.MONGO_DB_URL,
    dbName: process.env.MONGO_DB_NAME
  },
  serviceName: pkg.name,
  serviceVersion: pkg.version,
  messageBroker: {
    url: process.env.MESSAGE_BROKER_URL,
    channel: null
  },
  monitor: {
    route: process.env.MONITOR_ROUTE,
    user: process.env.MONITOR_USER,
    password: process.env.MONITOR_PASSWORD
  }
}

export default Config

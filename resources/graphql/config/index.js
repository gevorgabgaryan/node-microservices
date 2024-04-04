import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 7000,
};

export default config;
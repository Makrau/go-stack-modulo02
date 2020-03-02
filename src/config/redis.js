import dotenv from 'dotenv';

dotenv.config();

export default {
  host: process.env.REDDIS_HOST,
  port: process.env.REDDIS_PORT,
};

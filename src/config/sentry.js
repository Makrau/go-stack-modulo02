import dotenv from 'dotenv';

dotenv.config();

export default {
  dsn: process.env.SENTRY_DNS,
};

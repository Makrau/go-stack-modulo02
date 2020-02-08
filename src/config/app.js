const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT,
  database: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
  },
};

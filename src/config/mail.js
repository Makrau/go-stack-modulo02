import dotenv from 'dotenv';

dotenv.config();

export default {
  host: process.env.EMAIL_SERVICE_HOST,
  port: process.env.EMAIL_SERVICE_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVICE_USERNAME,
    pass: process.env.EMAIL_SERVICE_PASSWORD,
  },
  default: {
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  },
};

import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import appConfig from '../../config/app';

const { secret } = appConfig.auth;

export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authHeader.split(' ');

    const decoded = await promisify(jwt.verify)(token, secret);
    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};

import jwt from 'jsonwebtoken';

export const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
  }
  return process.env.JWT_SECRET;
};

export const signToken = (payload, options = {}) => {
  return jwt.sign(payload, getJwtSecret(), options);
};

export const verifyToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

export default {
  getJwtSecret,
  signToken,
  verifyToken,
};
